/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, UserProfile, CalendarReminder } from "./types";

export const INITIAL_PROFILE: UserProfile = {
  isLoggedIn: false, // Default to false as requested by the user
  name: "张伟",
  nickname: "张伟 (Zhang Wei)",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9LMd9XwZ6qzUAikT0dPgWRO5KzNVD3jnudXacqdhE6_wwT37Oc41sFONztxoHJ6pZ0XbRGFrXj9rK9kKlRwEnRueqVvfglpM1X62opXAugUXar8w27wtO8Tsmn8TUJmcyG4v_QhXIPTuy0TqToXMUfbY8XcbJMGnE4VYXBpgtlmRn6_eHkov9YiAIYS7XurXSvTEs-FNQLC9-OJPgoypMMg2x64X1C-hqd8jRuKc8AHB0qcYRK6mjefiBbdusLnR8qBUyb6n2Tkea",
  tag: "认证学生",
  university: "202408151229",
  major: "计算机科学与工程",
  studentId: "202408151229",
  gender: "男 (Male)",
  birthday: "2002-05-20"
};

export const INITIAL_POSTS: Post[] = [];

export const INITIAL_REMINDERS: CalendarReminder[] = [];

export const MAP_IMAGE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuCMuKxDwRgfKMskFAPnKfypZJoBjnv5Dn5HIx8jROVG9M5YEsm6SMqKYaRA1c2nyzR20eTdaWNG6S29JO2WbVONtPZhQQlC5xMkMW39pFX6geiy_okH1a1mC_JiS3i2St7PZ8N06104niDwfuyDR1A1yMUtXPeGrE2ESspjfGcwlOj4VQC8pMc36--W8a4D7bvBjgme9tyG1aJwVNLVfkX7ls6si5bmGb7RXy_HYWjw2ONFxj6Ievh-TBUG1HmioaqcSg35JAfpa_9X";
