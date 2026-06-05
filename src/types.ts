/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum NavigationTab {
  HOME = "HOME",
  COMMUNITY = "COMMUNITY",
  PROFILE = "PROFILE"
}

export enum ActiveScreen {
  MAIN = "MAIN",
  PUBLISH = "PUBLISH",
  GUIDE_DETAIL = "GUIDE_DETAIL",
  EDIT_PROFILE = "EDIT_PROFILE",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  CALENDAR = "CALENDAR",
  ENTRY_HELPER = "ENTRY_HELPER"
}


export enum GuideCategory {
  INSURANCE = "INSURANCE",
  BANK = "BANK",
  ARC = "ARC",
  RECYCLE = "RECYCLE",
  HOUSING = "HOUSING",
  TRANSIT = "TRANSIT",
  SHIPPING = "SHIPPING",
  KNU = "KNU"
}

export interface Comment {
  id: string;
  userId?: string;
  username: string;
  avatar: string;
  text: string;
  time: string;
}

export interface Post {
  id: string;
  userId?: string;
  username: string;
  avatar: string;
  time: string;
  text: string;
  image?: string;
  category: string; // e.g. "校园生活", "学习交流", "闲置交易", "问答求助"
  likes: number;
  commentsCount: number;
  commentsList: Comment[];
  hasLiked?: boolean;
  isBookmarked?: boolean;
  area: string; // e.g. "梨大商圈", "延大校区", "新村"
}

export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  nickname: string;
  avatar: string;
  tag: string; // e.g. "认证学生"
  university: string; // read-only e.g. "首尔大学"
  major: string;
  studentId: string; // read-only e.g. "202408151229"
  gender: string; // e.g. "男 (Male)", "女 (Female)"
  birthday: string; // e.g. "2002-05-20"
}

export interface CalendarReminder {
  id: string;
  title: string;
  date: string;
  time: string;
  enabled: boolean;
}

export interface Notification {
  id: string;
  userId: string;       // Target user who receives the notification (post owner)
  type: "like" | "comment";
  senderName: string;   // Who liked or commented
  senderAvatar: string; // Avatar of the sender
  postId: string;       // Related post ID
  postText: string;     // Snippet of the post text
  commentText?: string; // Content of the comment (optional)
  isRead: boolean;
  time: string;         // Relative time display (e.g., "刚刚")
  createdAt: string;    // ISO string timestamp
}

