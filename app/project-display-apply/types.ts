/**
 * Unified types for Project Display Apply interactive card.
 * Keep in sync with backend expectation once backend is ready.
 */
export interface ProjectLinkItem {
  id: string;           // unique id (uuid or timestamp)
  platform: string;     // e.g. scratch | 40code | github | other
  url: string;          // validated URL
}

export interface ShowcaseCardState {
  projectName: string;
  authorName: string;
  authorLink: string;        // optional external link for author
  projectBrief: string;      // <= 20 chars (UI enforced)
  links: ProjectLinkItem[];  // at least 1
  defaultLinkId: string;     // one of links.id
  coverFile: File | null;    // 4:3 final cropped file
  avatarFile: File | null;   // 1:1 final cropped file
  agreedNotice: boolean;     // read notice
  confirmedAuthor: boolean;  // author rights
  confirmedContent: boolean; // healthy content
}

export interface BackendPayloadMetaLink {
  platform: string;
  url: string;
  is_default?: boolean;
}

export interface BackendSubmissionDraft {
  project_name: string;
  author_name: string;
  author_link?: string;
  brief?: string;
  links: BackendPayloadMetaLink[];
}

/**
 * Build FormData payload ready for backend POST.
 * NOTE: Backend endpoint TBD; currently /api/v2/project-display-apply is used as placeholder.
 */
export function buildSubmissionFormData(state: ShowcaseCardState): FormData {
  const fd = new FormData();
  const draft: BackendSubmissionDraft = {
    project_name: state.projectName.trim(),
    author_name: state.authorName.trim(),
    author_link: state.authorLink.trim() || undefined,
    brief: state.projectBrief.trim() || undefined,
    links: state.links.map(l => ({
      platform: l.platform,
      url: l.url,
      is_default: l.id === state.defaultLinkId || undefined,
    })),
  };

  fd.append('meta', JSON.stringify(draft));
  if (state.coverFile) fd.append('cover', state.coverFile, 'cover.jpg');
  if (state.avatarFile) fd.append('avatar', state.avatarFile, 'avatar.jpg');
  return fd;
}

export function isSubmissionReady(state: ShowcaseCardState): boolean {
  return !!(
    state.projectName &&
    state.authorName &&
    state.coverFile &&
    state.avatarFile &&
    state.links.length > 0 &&
    state.defaultLinkId &&
    state.agreedNotice &&
    state.confirmedAuthor &&
    state.confirmedContent
  );
}
