// Composable to check if a post should be visible (not future-dated)
export function usePostVisibility() {
  const isPostVisible = (post: { date?: Date | string }): boolean => {
    if (!post?.date) return true
    
    const postDate = new Date(post.date)
    const now = new Date()
    
    // Set both dates to midnight for accurate comparison
    postDate.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)
    
    return postDate <= now
  }

  const filterVisiblePosts = <T extends { date?: Date | string }>(posts: T[]): T[] => {
    return posts.filter(isPostVisible)
  }

  return {
    isPostVisible,
    filterVisiblePosts
  }
}
