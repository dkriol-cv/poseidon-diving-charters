import React, { createContext, useState, useCallback } from 'react';

export const BlogContext = createContext({
  refreshTrigger: 0,
  refreshBlogData: () => {}
});

export const BlogProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshBlogData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    console.log('[BlogContext] Blog data refresh triggered');
  }, []);

  return (
    <BlogContext.Provider value={{ refreshTrigger, refreshBlogData }}>
      {children}
    </BlogContext.Provider>
  );
};