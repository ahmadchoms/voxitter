export default async function jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.username = user.username;
    token.full_name = user.full_name;
    token.avatar_url = user.avatar_url;
    token.bio = user.bio;
    token.role = user.role;
    token.points = user.points;
    token.is_verified = user.is_verified;
    token.post_count = user.post_count;
  }
  return token;
}
