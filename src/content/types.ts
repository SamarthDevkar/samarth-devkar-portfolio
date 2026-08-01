/**
 * Content model for the portfolio.
 *
 * CONTENT INTEGRITY RULE
 * Every string rendered from these types must trace to either:
 *   a) my resume, or
 *   b) a public repository README verified via the GitHub API.
 * Nothing here may be invented, no metrics, employers, dates,
 * technologies, outcomes, or links. Absent data is `undefined`, never a
 * placeholder and never a plausible guess.
 */

export interface SiteConfig {
  readonly name: string;
  readonly firstName: string;
  readonly role: string;
  readonly roleLong: string;
  readonly positioning: string;
  /** First-person introduction used in the home hero. */
  readonly intro: string;
  readonly creed: string;
  readonly summary: string;
  readonly location: string;
  readonly email: string;
  readonly url: string;
  readonly resumePath: string;
  readonly locale: string;
}

/**
 * Booking link for a scheduled call.
 *
 * Deliberately a link-out, not an embedded widget: an embed would require
 * whitelisting a third-party origin in the CSP, ship third-party JavaScript,
 * and load every visitor into an external tracker before they have clicked
 * anything. A link costs none of that.
 */
export interface Booking {
  readonly label: string;
  readonly description: string;
  readonly duration: string;
  /**
   * Google Calendar appointment schedule URL. Absent until supplied, the
   * booking card does not render at all rather than showing a dead button.
   */
  readonly href?: string;
}

/**
 * Hiring logistics. US recruiters screen on work authorisation before almost
 * anything else, so it is stated plainly rather than left to a conversation.
 */
export interface Availability {
  readonly status: string;
  readonly authorisation: string;
  readonly arrangements: string;
  readonly roles: readonly string[];
}

export type SocialPlatform = "GitHub" | "LinkedIn" | "Email";

export interface SocialLink {
  readonly platform: SocialPlatform;
  readonly label: string;
  readonly href: string;
  /** Shown as the accessible name; external links append context. */
  readonly external: boolean;
}

export interface NavItem {
  readonly label: string;
  readonly href: string;
  /** Section id on the home page, when the nav item scrolls rather than routes. */
  readonly sectionId?: string;
}

export type ProjectDomain =
  | "AI Security"
  | "Threat Intelligence"
  | "Detection Engineering"
  | "Security Telemetry"
  | "Linux Security";

export type LinkKind = "source" | "paper" | "demo";

export interface ProjectLink {
  readonly kind: LinkKind;
  readonly label: string;
  /** Absent when no URL has been verified. Rendered as plain text, not a dead link. */
  readonly href?: string;
  /**
   * Honest qualifier shown next to the link, e.g. when a public repository
   * contains only part of the described system. Prevents a click-through
   * from misrepresenting scope.
   */
  readonly caveat?: string;
}

/**
 * A measured result. Shown verbatim, including unflattering figures -
 * publishing only the strong numbers would misrepresent the evaluation.
 */
export interface EvaluationResult {
  readonly metric: string;
  readonly value: string;
  readonly note?: string;
}

/** One row of a project's architecture diagram. */
export interface PipelineStage {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly tools: readonly string[];
}

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly period: string;
  readonly tagline: string;
  readonly domains: readonly ProjectDomain[];
  /** 1–2 sentences, used on cards and in metadata descriptions. */
  readonly summary: string;
  readonly problem: string;
  readonly role: string;
  readonly built: readonly string[];
  readonly challenge: string;
  readonly relevance: string;
  readonly stack: readonly string[];
  readonly stages: readonly PipelineStage[];
  /** Measured evaluation results, where the project was formally evaluated. */
  readonly evaluation?: readonly EvaluationResult[];
  /** How the evaluation was conducted, required whenever `evaluation` is set. */
  readonly evaluationBasis?: string;
  readonly links: readonly ProjectLink[];
  readonly featured: boolean;
  /** Alt text for the generated architecture diagram. Context, not filename. */
  readonly diagramAlt: string;
}

export interface ExperienceEntry {
  readonly slug: string;
  readonly role: string;
  readonly organisation: string;
  readonly period: string;
  readonly location: string;
  readonly contributions: readonly string[];
  readonly focus: readonly string[];
}

export interface EducationEntry {
  readonly degree: string;
  readonly specialisation?: string;
  readonly institution: string;
  readonly grade: string;
  readonly period: string;
  readonly location: string;
}

export interface Publication {
  readonly title: string;
  readonly venue: string;
  readonly year: string;
  readonly kind: "Conference paper" | "Conference demonstration";
  /** Status detail, e.g. that the demonstration was actually presented. */
  readonly note?: string;
  readonly relatedProjectSlug?: string;
  /** Absent until a DOI or IEEE Xplore link is supplied, never fabricated. */
  readonly href?: string;
}

export interface Honour {
  readonly title: string;
  readonly issuer: string;
  readonly year: string;
}

export interface Certification {
  readonly title: string;
  readonly issuer: string;
  /** Absent: the résumé lists no credential ID or expiry. */
  readonly credentialId?: string;
}

export interface SkillGroup {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly skills: readonly string[];
  /** Project slugs that evidence this capability group. */
  readonly evidence: readonly string[];
}
