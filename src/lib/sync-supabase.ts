import { supabase } from "@/lib/supabase";
import { authService } from "@/lib/auth-service";
import { prestationService } from "@/lib/prestation-service";
import { songService } from "@/lib/song-service";
import { setlistService } from "@/lib/setlist-service";
import { repetitionService } from "@/lib/repetition-service";
import { documentService } from "@/lib/document-service";
import { indisponibiliteService } from "@/lib/indisponibilite-service";
import { materielService } from "@/lib/materiel-service";
import { notificationService } from "@/lib/notification-service";

export interface SyncReportItem {
  table: string;
  count: number;
  status: "success" | "warning" | "error";
  message: string;
}

export async function syncAllToSupabase(): Promise<SyncReportItem[]> {
  const report: SyncReportItem[] = [];

  if (!supabase) {
    return [
      {
        table: "Supabase Client",
        count: 0,
        status: "error",
        message: "Supabase client non initialisé ou clé manquante.",
      },
    ];
  }

  // 1. Synchronisation des Musiciens / Profils
  try {
    const users = authService.getAvailableProfiles();
    const officialNames = new Set(users.map((u) => u.prenom));
    const { data: existingMusicians } = await supabase.from("musicians").select("id, prenom");

    if (existingMusicians) {
      const toDeleteIds = existingMusicians
        .filter((m) => !officialNames.has(m.prenom))
        .map((m) => m.id);

      if (toDeleteIds.length > 0) {
        await supabase.from("musicians").delete().in("id", toDeleteIds);
      }
    }

    for (const u of users) {
      const existing = existingMusicians?.find((m) => m.prenom === u.prenom);
      const row = {
        prenom: u.prenom,
        role: u.instrument || u.role,
        ville: u.ville || null,
        actif: u.actif !== false,
      };

      if (existing) {
        await supabase.from("musicians").update(row).eq("id", existing.id);
      } else {
        await supabase.from("musicians").insert([row]);
      }
    }

    report.push({
      table: "musicians",
      count: users.length,
      status: "success",
      message: `${users.length} profils de musiciens synchronisés dans Supabase.`,
    });
  } catch (err: any) {
    report.push({
      table: "musicians",
      count: 0,
      status: "warning",
      message: `Sync musiciens ignoré/table absente: ${err?.message || err}`,
    });
  }

  // 2. Synchronisation des Événements / Prestations
  try {
    const prestations = prestationService.getAll();
    const toInsertEvents = prestations.map((p) => ({
      id: p.id,
      titre: p.titre,
      date: p.date,
      heure_arrivee: p.heureArrivee,
      heure_debut: p.heureDebut,
      heure_fin: p.heureFin,
      lieu: p.lieu,
      adresse: p.adresse,
      infos_lieu: p.infosLieu || null,
      formation: p.formation,
      dress_code: p.dressCode || null,
      status: p.status,
      responsable_id: p.responsableId,
    }));

    const { error } = await supabase.from("events").upsert(toInsertEvents);
    if (error) {
      report.push({
        table: "events",
        count: prestations.length,
        status: "warning",
        message: `Sync prestations : ${error.message}`,
      });
    } else {
      report.push({
        table: "events",
        count: prestations.length,
        status: "success",
        message: `${prestations.length} prestations synchronisées dans la table events.`,
      });
    }

    // Synchronisation de la table de jonction event_musicians
    try {
      const eventMusiciansRows: { event_id: string; musician_id: string }[] = [];
      prestations.forEach((p) => {
        p.musicianIds.forEach((mId) => {
          eventMusiciansRows.push({ event_id: p.id, musician_id: mId });
        });
      });

      if (eventMusiciansRows.length > 0) {
        await supabase.from("event_musicians").upsert(eventMusiciansRows);
        report.push({
          table: "event_musicians",
          count: eventMusiciansRows.length,
          status: "success",
          message: `${eventMusiciansRows.length} affectations musiciens/prestations synchronisées.`,
        });
      }
    } catch (emErr: any) {
      // Ignorer si la table n'existe pas encore
    }
  } catch (err: any) {
    report.push({
      table: "events",
      count: 0,
      status: "warning",
      message: `Sync events : ${err?.message || err}`,
    });
  }

  // 3. Synchronisation des Morceaux (Songs)
  try {
    const songs = songService.getAll();
    const toInsertSongs = songs.map((s) => ({
      id: s.id,
      titre: s.titre,
      artiste: s.artiste,
      statut: s.statut,
      arrangement_info: s.arrangementInfo || null,
    }));


    const { error } = await supabase.from("songs").upsert(toInsertSongs);
    if (error) {
      report.push({
        table: "songs",
        count: songs.length,
        status: "warning",
        message: `Sync morceaux : ${error.message}`,
      });
    } else {
      report.push({
        table: "songs",
        count: songs.length,
        status: "success",
        message: `${songs.length} morceaux de l'Espace Musical synchronisés.`,
      });
    }
  } catch (err: any) {
    report.push({
      table: "songs",
      count: 0,
      status: "warning",
      message: `Table songs : ${err?.message || err}`,
    });
  }

  // 4. Synchronisation des Setlists
  try {
    const setlists = setlistService.getAll();
    const toInsertSetlists = setlists.map((st) => ({
      id: st.id,
      prestation_id: st.prestationId,
      statut: st.statut,
      song_ids: st.items.map((i) => i.songId),
      updated_at: st.updatedAt,
    }));


    const { error } = await supabase.from("setlists").upsert(toInsertSetlists);
    if (error) {
      report.push({
        table: "setlists",
        count: setlists.length,
        status: "warning",
        message: `Sync setlists : ${error.message}`,
      });
    } else {
      report.push({
        table: "setlists",
        count: setlists.length,
        status: "success",
        message: `${setlists.length} setlists de concert synchronisées.`,
      });
    }
  } catch (err: any) {
    report.push({
      table: "setlists",
      count: 0,
      status: "warning",
      message: `Table setlists : ${err?.message || err}`,
    });
  }

  // 5. Synchronisation des Répétitions
  try {
    const repetitions = repetitionService.getAll();
    const toInsertReps = repetitions.map((r) => ({
      id: r.id,
      titre: r.titre,
      date: r.date,
      heure_debut: r.heureDebut,
      heure_fin: r.heureFin,
      lieu: r.lieu,
      objet: r.objet,
      statut: r.status,
      musician_ids: r.musicianIds,
    }));


    const { error } = await supabase.from("repetitions").upsert(toInsertReps);
    if (error) {
      report.push({
        table: "repetitions",
        count: repetitions.length,
        status: "warning",
        message: `Sync répétitions : ${error.message}`,
      });
    } else {
      report.push({
        table: "repetitions",
        count: repetitions.length,
        status: "success",
        message: `${repetitions.length} séances de répétitions synchronisées.`,
      });
    }
  } catch (err: any) {
    report.push({
      table: "repetitions",
      count: 0,
      status: "warning",
      message: `Table repetitions : ${err?.message || err}`,
    });
  }

  // 6. Synchronisation des Documents Centraux
  try {
    const docs = documentService.getAll();
    const toInsertDocs = docs.map((d) => ({
      id: d.id,
      nom: d.nom,
      categorie: d.categorie,
      type: d.type,
      file_url: d.fileUrl,
      taille: d.taille || null,
      created_at: d.dateAjout,
      user_id: d.userId || null,
      song_id: d.songId || null,
      prestation_id: d.prestationId || null,
      repetition_id: d.repetitionId || null,
    }));


    const { error } = await supabase.from("documents").upsert(toInsertDocs);
    if (error) {
      report.push({
        table: "documents",
        count: docs.length,
        status: "warning",
        message: `Sync GED documents : ${error.message}`,
      });
    } else {
      report.push({
        table: "documents",
        count: docs.length,
        status: "success",
        message: `${docs.length} documents centraux synchronisés.`,
      });
    }
  } catch (err: any) {
    report.push({
      table: "documents",
      count: 0,
      status: "warning",
      message: `Table documents : ${err?.message || err}`,
    });
  }

  // 7. Synchronisation des Indisponibilités
  try {
    const indisps = indisponibiliteService.getAll();
    const toInsertIndisps = indisps.map((i) => ({
      id: i.id,
      user_id: i.userId,
      date: i.date,
      notes: i.note || null,
    }));


    const { error } = await supabase.from("indisponibilites").upsert(toInsertIndisps);
    if (error) {
      report.push({
        table: "indisponibilites",
        count: indisps.length,
        status: "warning",
        message: `Sync indisponibilités : ${error.message}`,
      });
    } else {
      report.push({
        table: "indisponibilites",
        count: indisps.length,
        status: "success",
        message: `${indisps.length} indisponibilités musiciens synchronisées.`,
      });
    }
  } catch (err: any) {
    report.push({
      table: "indisponibilites",
      count: 0,
      status: "warning",
      message: `Table indisponibilites : ${err?.message || err}`,
    });
  }

  // 8. Synchronisation des Missions Matériel
  try {
    const missions = materielService.getAllMissions();
    const toInsertMissions = missions.map((m) => ({
      id: m.id,
      prestation_id: m.prestationId,
      titre: m.titre,
      responsable_id: m.responsableId,
      statut: m.statut,
      description: m.description || null,
    }));


    const { error } = await supabase.from("materiel_missions").upsert(toInsertMissions);
    if (error) {
      report.push({
        table: "materiel_missions",
        count: missions.length,
        status: "warning",
        message: `Sync matériel : ${error.message}`,
      });
    } else {
      report.push({
        table: "materiel_missions",
        count: missions.length,
        status: "success",
        message: `${missions.length} missions matériel synchronisées.`,
      });
    }
  } catch (err: any) {
    report.push({
      table: "materiel_missions",
      count: 0,
      status: "warning",
      message: `Table materiel_missions : ${err?.message || err}`,
    });
  }

  // 9. Synchronisation des Notifications
  try {
    const notifications = notificationService.getAll();
    const toInsertNotifs = notifications.map((n) => ({
      id: n.id,
      user_id: n.userId,
      type: n.type,
      titre: n.title,
      message: n.message,
      date: n.createdAt,
      lu: n.isRead,
      target_url: n.targetUrl || null,
    }));


    const { error } = await supabase.from("notifications").upsert(toInsertNotifs);
    if (error) {
      report.push({
        table: "notifications",
        count: notifications.length,
        status: "warning",
        message: `Sync notifications : ${error.message}`,
      });
    } else {
      report.push({
        table: "notifications",
        count: notifications.length,
        status: "success",
        message: `${notifications.length} notifications synchronisées.`,
      });
    }
  } catch (err: any) {
    report.push({
      table: "notifications",
      count: 0,
      status: "warning",
      message: `Table notifications : ${err?.message || err}`,
    });
  }

  return report;
}
