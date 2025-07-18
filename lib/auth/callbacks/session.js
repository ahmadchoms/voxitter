export default async function session({ session, token }) {
  if (session.user) {
    session.user = {
      ...session.user,
      id: token.id,
      username: token.username,
      full_name: token.full_name,
      avatar_url: token.avatar_url,
      bio: token.bio,
      points: token.points,
      is_verified: token.is_verified,
      post_count: token.post_count,
    };
  }
  return session;
}
