import { notificationService } from "../../../core/notifications/notificationService";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { ForumComment, ForumPost, User } from "../../../core/types/domain";
import { createId } from "../../../core/utils/createId";

function readPosts(): ForumPost[] {
  return localStorageService.get<ForumPost[]>(storageKeys.forumPosts, []).value;
}

function readComments(): ForumComment[] {
  return localStorageService.get<ForumComment[]>(storageKeys.forumComments, []).value;
}

function findPost(posts: ForumPost[], id: string): [ForumPost, number] {
  const index = posts.findIndex((post) => post.id === id);
  const post = posts[index];
  if (!post) throw new Error("La publicación ya no existe.");
  return [post, index];
}

export const forumRepository = {
  list(user: User): ForumPost[] {
    return readPosts()
      .filter((post) => user.role === "ADMIN" || post.status !== "HIDDEN")
      .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
  },

  comments(postId: string): ForumComment[] {
    return readComments().filter((comment) => comment.postId === postId && comment.status === "ACTIVE");
  },

  create(user: User, input: Pick<ForumPost, "title" | "body" | "category">): ForumPost {
    if (input.title.trim().length < 3 || input.body.trim().length < 5) throw new Error("Completa el título y el contenido.");
    const timestamp = new Date().toISOString();
    const post: ForumPost = {
      id: createId("post"),
      authorUserId: user.id,
      title: input.title.trim(),
      body: input.body.trim(),
      category: input.category,
      status: "ACTIVE",
      reactionUserIds: [],
      reportCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    localStorageService.set(storageKeys.forumPosts, [...readPosts(), post]);
    return post;
  },

  addComment(user: User, postId: string, body: string, parentCommentId?: string): ForumComment {
    if (body.trim().length < 2) throw new Error("Escribe un comentario antes de enviarlo.");
    const posts = readPosts();
    const [post] = findPost(posts, postId);
    if (post.status !== "ACTIVE") throw new Error("La publicación está cerrada.");
    const timestamp = new Date().toISOString();
    const comment: ForumComment = {
      id: createId("comment"),
      postId,
      parentCommentId,
      authorUserId: user.id,
      body: body.trim(),
      status: "ACTIVE",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    localStorageService.set(storageKeys.forumComments, [...readComments(), comment]);
    if (post.authorUserId !== user.id) notificationService.create({
      userId: post.authorUserId,
      type: "FORUM",
      title: "Nuevo comentario",
      message: `Respondieron en “${post.title}”.`,
      link: "/forum",
    });
    return comment;
  },

  toggleReaction(user: User, postId: string): ForumPost {
    const posts = readPosts();
    const [post, index] = findPost(posts, postId);
    const reactions = new Set(post.reactionUserIds);
    if (reactions.has(user.id)) reactions.delete(user.id);
    else reactions.add(user.id);
    const updated = { ...post, reactionUserIds: [...reactions], updatedAt: new Date().toISOString() };
    posts[index] = updated;
    localStorageService.set(storageKeys.forumPosts, posts);
    return updated;
  },

  report(postId: string): ForumPost {
    const posts = readPosts();
    const [post, index] = findPost(posts, postId);
    const updated = { ...post, reportCount: post.reportCount + 1, updatedAt: new Date().toISOString() };
    posts[index] = updated;
    localStorageService.set(storageKeys.forumPosts, posts);
    return updated;
  },

  moderate(actor: User, postId: string, status: ForumPost["status"]): ForumPost {
    if (actor.role !== "ADMIN") throw new Error("Solo Administración puede moderar el foro.");
    const posts = readPosts();
    const [post, index] = findPost(posts, postId);
    const updated = { ...post, status, updatedAt: new Date().toISOString() };
    posts[index] = updated;
    localStorageService.set(storageKeys.forumPosts, posts);
    return updated;
  },
};
