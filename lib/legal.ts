/**
 * Legal identity of the publisher — single source for mentions légales, privacy policy,
 * CGU and cookie page. `null` = information still missing: pages show a visible
 * "[À COMPLÉTER …]" marker instead of inventing anything.
 *
 * Sources: SIRENE registry (annuaire-entreprises.data.gouv.fr, checked 2026-09-25).
 * Still to fill from the Kbis extract, the insurance certificate and the mediator contract.
 */
export const LEGAL = {
  companyName: "ATOUTS SERVICES",
  legalForm: "SARL (société à responsabilité limitée)",
  /** Capital social — on the Kbis extract. */
  shareCapital: null as string | null,
  siren: "490 173 697",
  siret: "490 173 697 00049",
  /** Greffe of the Hauts-de-Seine is Nanterre; confirm on the Kbis extract. */
  rcs: "RCS Nanterre 490 173 697",
  /** Computed from the SIREN with the official key formula; confirm on an invoice or the Kbis. */
  vatNumber: "FR36 490 173 697",
  /** Répertoire des métiers number, if the company is also registered at the Chambre de métiers. */
  rmNumber: null as string | null,
  nafCode: "43.21A — Travaux d'installation électrique dans tous locaux",
  address: "20 rue d'Estienne d'Orves, 92130 Issy-les-Moulineaux, France",
  email: "atouts.services92@gmail.com",
  phone: "06 34 02 61 80",
  /** Directeur de la publication (LCEN art. 6): the gérant, per the SIRENE registry. */
  publicationDirector: "Maroun ABI ATMI, gérant",

  /** Garantie décennale — on the insurance certificate (attestation d'assurance). */
  insurer: {
    /** Confirmed by the owner 2026-09-26; exact entity (e.g. AXA France IARD), address and policy number: see the certificate */
    name: "AXA" as string | null,
    address: null as string | null,
    policyNumber: null as string | null,
    coverage: null as string | null,
  },

  /**
   * Médiateur de la consommation (Code de la consommation L612-1, L616-1, R616-1).
   * Left empty for now at the owner's request (2026-09-25): mediation sections are HIDDEN from the
   * legal pages until `name` is filled in, then they reappear automatically.
   */
  mediator: {
    name: null as string | null,
    website: null as string | null,
    address: null as string | null,
  },

  hosts: {
    frontend: {
      name: "Vercel Inc.",
      address: "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis",
      website: "https://vercel.com",
    },
    backend: {
      name: "Render Services, Inc.",
      address: null as string | null,
      website: "https://render.com",
      /** Database and API region — keep personal data in the EU. */
      region: "Francfort (Allemagne, Union européenne)",
    },
  },

  /** Provider that sends the site's emails (SMTP). */
  emailProvider: null as string | null,

  lastUpdated: "25 septembre 2026",
} as const;
