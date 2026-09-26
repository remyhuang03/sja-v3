/**
 * Unified types for Project Display Apply interactive card.
 * API Endpoint: /api/v2/project-display-apply
 * API Documentation: /docs/api-project-apply.md
 */
export interface ProjectLinkItem {
  id: string; // unique id (uuid or timestamp)
  platform: string; // e.g. scratch | 40code | ccw | aerfaying | github | other
  url: string; // validated URL
}

export interface ShowcaseCardState {
  projectName: string;
  authorName: string;
  authorLink: string; // required: author homepage link
  projectBrief: string; // required: <= 20 chars
  links: ProjectLinkItem[]; // at least 1
  defaultLinkId: string; // one of links.id
  coverFile: File | null; // 4:3 cover image
  avatarFile: File | null; // 1:1 avatar image
  agreedNotice: boolean; // read notice
  confirmedAuthor: boolean; // author rights
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
  author_link: string; // required
  brief: string; // required
  links: BackendPayloadMetaLink[];
}

/**
 * Build FormData payload for submission to /api/v2/project-display-apply
 *
 * FormData structure:
 * - meta: JSON string containing project metadata
 * - cover: Image file (cover.jpg)
 * - avatar: Image file (avatar.jpg)
 *
 * See /docs/api-project-apply.md for complete API documentation
 */
export function buildSubmissionFormData(state: ShowcaseCardState): FormData {
  const fd = new FormData();
  const draft: BackendSubmissionDraft = {
    project_name: state.projectName.trim(),
    author_name: state.authorName.trim(),
    author_link: state.authorLink.trim(),
    brief: state.projectBrief.trim(),
    links: state.links.map((l) => ({
      platform: l.platform,
      url: l.url,
      is_default: l.id === state.defaultLinkId || undefined,
    })),
  };

  fd.append("meta", JSON.stringify(draft));
  if (state.coverFile) fd.append("cover", state.coverFile, "cover.jpg");
  if (state.avatarFile) fd.append("avatar", state.avatarFile, "avatar.jpg");
  return fd;
}

export function isSubmissionReady(state: ShowcaseCardState): boolean {
  return !!(
    state.projectName &&
    state.authorName &&
    state.authorLink &&
    state.projectBrief &&
    state.projectBrief.length <= 20 &&
    state.coverFile &&
    state.avatarFile &&
    state.links.length > 0 &&
    state.defaultLinkId &&
    state.agreedNotice &&
    state.confirmedAuthor &&
    state.confirmedContent
  );
}

export function getValidationErrors(
  state: ShowcaseCardState,
  t: (key: string) => string,
): string[] {
  const errors: string[] = [];
  if (!state.projectName) errors.push(t("enterAProjectName2"));
  if (!state.authorName) errors.push(t("enterAnAuthorName2"));
  if (!state.authorLink) errors.push(t("enterTheAuthorProfileUrl"));
  if (!state.projectBrief) errors.push(t("enterAProjectDescription"));
  if (state.projectBrief && state.projectBrief.length > 20)
    errors.push(t("theDescriptionMustNotExceed20Characters"));
  if (!state.coverFile) errors.push(t("uploadACoverImage"));
  if (state.coverFile && state.coverFile.size > 5 * 1024 * 1024)
    errors.push(t("theCoverImageMustNotExceed5Mib"));
  if (!state.avatarFile) errors.push(t("uploadAnAvatar"));
  if (state.avatarFile && state.avatarFile.size > 2 * 1024 * 1024)
    errors.push(t("theAvatarMustNotExceed2Mib"));
  if (state.links.length === 0) errors.push(t("addAtLeastOneProjectLink"));
  if (!state.links.some((link) => link.id === state.defaultLinkId))
    errors.push(t("chooseADefaultProjectLink"));
  if (!state.agreedNotice)
    errors.push(t("readAndAcceptTheSubmissionRequirements"));
  if (!state.confirmedAuthor)
    errors.push(t("confirmThatYouHavePermissionFromTheAuthor"));
  if (!state.confirmedContent)
    errors.push(t("confirmThatTheContentIsAppropriate"));
  return errors;
}
