export type Properties = Record<string, string | number | boolean>;

// 15 default events plus 7 optional diagnostics. Retired/unknown events are dropped.
// This registry is also the runtime property allowlist.
export const eventFields = {
  page_engaged: ['active_seconds'],
  mobile_menu_toggle: ['state'],
  theme_change: ['from_theme', 'to_theme'],
  project_impression: ['project_id', 'category'],
  project_click: ['project_id', 'category', 'destination', 'placement'],
  contact_click: ['channel', 'placement', 'resume_version'],
  friend_link_click: ['target_id', 'target_host', 'placement'],
  outbound_click: ['target_host', 'target_path', 'placement', 'article_slug', 'resume_version'],
  github_chart_view: ['placement'],
  blog_filter_change: ['from_tag', 'to_tag', 'result_count'],
  article_open_click: ['article_slug', 'position', 'active_tag', 'placement'],
  article_read_start: ['article_slug'],
  article_read_qualified: ['article_slug', 'required_seconds'],
  media_close: ['article_slug', 'media_type', 'media_id', 'reason'],
  comments_load: ['article_slug'],
  resume_version_view: ['version_id'],
  resume_version_change: ['from_version', 'to_version'],
  book_open: ['book_id', 'stage_id', 'cluster_id'],
  book_close: ['book_id', 'stage_id', 'reason'],
  not_found_view: ['requested_path'],
  app_error: ['error_code', 'digest'],
  resource_error: ['resource_type', 'resource_id', 'error_code'],
} as const;
export type EventName = keyof typeof eventFields;
export type EventProperties<N extends EventName> = Partial<Record<(typeof eventFields)[N][number], string | number | boolean>>;

export function clickAttributes<N extends EventName>(event: N, props: EventProperties<N>) {
  return { 'data-analytics-click': event, 'data-analytics-props': JSON.stringify(props) };
}
export function viewAttributes<N extends EventName>(event: N, props: EventProperties<N>, mode: 'area' | 'start' = 'area') {
  return { 'data-analytics-view': event, 'data-analytics-view-props': JSON.stringify(props), 'data-analytics-view-mode': mode };
}
