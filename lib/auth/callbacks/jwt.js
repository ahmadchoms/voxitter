export default async function jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.username = user.username;
    token.full_name = user.full_name;
    token.avatar_url = user.avatar_url;
    token.bio = user.bio;
    token.points = user.points;
    token.is_verified = user.is_verified;
    token.posts_count = user.posts_count;
  }
  return token;
}
