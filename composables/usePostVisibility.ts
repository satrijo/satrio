// Composable to check if a post should be visible (not future-dated)
export function usePostVisibility() {
  const isPostVisible = (post: { date?: Date | string }): boolean => {
    if (!post?.date) return true
    
    const postDate = new Date(post.date)
    const now = new Date()
    
    // Get date parts only (year, month, day) for comparison
    // This ensures articles published today are visible
    const postYear = postDate.getFullYear()
    const postMonth = postDate.getMonth()
    const postDay = postDate.getDate()
    
    const nowYear = now.getFullYear()
    const nowMonth = now.getMonth()
    const nowDay = now.getDate()
    
    // Compare dates: post date should be <= today
    if (postYear < nowYear) return true
    if (postYear > nowYear) return false
    if (postMonth < nowMonth) return true
    if (postMonth > nowMonth) return false
    return postDay <= nowDay
  }

  const filterVisiblePosts = <T extends { date?: Date | string }>(posts: T[]): T[] => {
    return posts.filter(isPostVisible)
  }

  return {
    isPostVisible,
    filterVisiblePosts
  }
}
