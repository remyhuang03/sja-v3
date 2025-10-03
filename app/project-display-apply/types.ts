/**
 * Unified types for Project Display Apply interactive card.
 * API Endpoint: https://api.sjaplus.top/project-apply
 * API Documentation: /docs/api-project-apply.md
 */
export interface ProjectLinkItem {
  id: string;           // unique id (uuid or timestamp)
  platform: string;     // e.g. scratch | 40code | ccw | aerfaying | github | other
  url: string;          // validated URL
}

export interface ShowcaseCardState {
  projectName: string;
  authorName: string;
  authorLink: string;        // required: author homepage link
  projectBrief: string;      // required: <= 20 chars
  links: ProjectLinkItem[];  // at least 1
  defaultLinkId: string;     // one of links.id
  coverFile: File | null;    // 4:3 cover image
  avatarFile: File | null;   // 1:1 avatar image
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
  author_link: string;      // required
  brief: string;            // required
  links: BackendPayloadMetaLink[];
}

/**
 * Build FormData payload for submission to https://api.sjaplus.top/project-apply
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

export function getValidationErrors(state: ShowcaseCardState): string[] {
  const errors: string[] = [];
  if (!state.projectName) errors.push('请填写作品名称');
  if (!state.authorName) errors.push('请填写作者名称');
  if (!state.authorLink) errors.push('请填写作者主页链接');
  if (!state.projectBrief) errors.push('请填写作品简介');
  if (state.projectBrief && state.projectBrief.length > 20) errors.push('作品简介不能超过20字');
  if (!state.coverFile) errors.push('请上传封面图片');
  if (!state.avatarFile) errors.push('请上传头像图片');
  if (state.links.length === 0) errors.push('请至少添加一个作品链接');
  if (!state.defaultLinkId) errors.push('请设置默认作品链接');
  if (!state.agreedNotice) errors.push('请阅读并同意申请须知');
  if (!state.confirmedAuthor) errors.push('请确认已获得作者授权');
  if (!state.confirmedContent) errors.push('请确认作品内容健康');
  return errors;
}
