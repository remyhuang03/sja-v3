export type Website = {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  icon_path: string;
};
export type WebsiteSubmission = Website & {
  status: "pending" | "approved" | "rejected";
  reviewer_notes: string;
  created_at: string;
};
