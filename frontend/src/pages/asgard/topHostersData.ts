export const TOP_HOSTERS: string[] = [
  "𝐀𝐑𝐂",
  "⚡THOR",
  "HARRY",
  "𝐋𝐮𝐬𝐭➣💋",
  "🐉Wavy",
  "BEAST",
  "♛𝐅𝐋𝕰𝖃𝖃𝚨̸❤️‍🔥",
  "𝘼𝘿𝘿𝙔𝙔⚜️🚬",
  "𝐇𝐚𝐰𝐬𝐢",
  "⛩️𝙆𝙐𝙉𝘼𝙇",
];

export const TOP_ADMINS: string[] = [
  "🗽𝐀𝐚𝐫𝐚𝐯",
  "⚜️𝐍𝐈𝐂𝐊",
  "𝕊𝕒𝕟𝕛𝕦🫂",
  "No Name",




];

export const TOP_BANNERS: string[] = [
  "No Name",
  "No Name",
  "No Name",
  "No Name",



];

/**
 * Hall of Fame leaderboards — just names, in rank order, one array per
 * section (Top Hosters / Top Admins / Top Banners).
 *
 * Rank 1 = top of the array, rank 2 = next, and so on. To add or
 * reorder someone, edit the relevant array only — nothing else needs
 * to change.
 *
 * Each name's photo is read automatically from that section's image
 * folder, matched by rank:
 *   TOP_HOSTERS -> frontend/public/assets/asgard/TopHosters/top<rank>.png
 *   TOP_ADMINS  -> frontend/public/assets/asgard/TopAdmins/top<rank>.png
 *   TOP_BANNERS -> frontend/public/assets/asgard/TopBanners/top<rank>.png
 * e.g. rank 1 -> top1.png, rank 2 -> top2.png, rank 10 -> top10.png
 *
 * If a photo is missing, the UI automatically falls back to the
 * person's initials — no need to add a placeholder image.
 *
 * Names can include emoji or any special/stylized Unicode characters
 * exactly as the person uses them — they'll render as typed.
 */