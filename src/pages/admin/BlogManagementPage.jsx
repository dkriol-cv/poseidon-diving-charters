import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { formatBlogDate } from '@/lib/blogHelpers';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  RefreshCw, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlogContext } from '@/contexts/BlogContext';

const PAGE_SIZE = 10;

const BlogManagementPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshBlogData } = useContext(BlogContext);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (page - 1) * PAGE_SIZE;
      
      let query = supabase
        .from('blog_posts')
        .select('id, title, slug, status, category, published_at, views_count, created_at, updated_at, author, excerpt', { count: 'exact' })
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        console.error('[BlogManagementPage] Supabase error:', fetchError);
        throw fetchError;
      }

      console.log('[BlogManagementPage] Posts loaded:', data?.length || 0);
      setPosts(data || []);
      setTotalCount(count || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error('[BlogManagementPage] Unexpected error:', err);
      setError(err?.message || 'Failed to load blog posts. Database connection error.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [searchTerm, statusFilter]); // Re-fetch on filter changes

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', deleteId);

      if (deleteError) throw deleteError;
      
      toast({ title: 'Success', description: 'Post deleted successfully.' });
      
      // Refresh current page
      fetchPosts(currentPage);
      refreshBlogData();
    } catch (err) {
      console.error('[BlogManagementPage] Error in handleDelete:', err);
      toast({ title: 'Delete Failed', description: 'Error deleting post.', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  // Error UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Error Loading Posts</h1>
        <p className="text-gray-600">{error}</p>
        <div className="flex gap-3">
          <Button onClick={() => fetchPosts(1)}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  // Loading UI before initial render
  if (loading && posts.length === 0 && !searchTerm) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#03c4c9]" />
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2d353b]">Blog Management</h1>
          <p className="text-gray-500">Create, edit and manage Poseidon blog articles.</p>
        </div>
        <Button asChild className="bg-[#03c4c9] text-white hover:bg-[#02a8ad]">
          <Link to="/admin/blog/new"><Plus className="w-4 h-4 mr-2" /> New Post</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => fetchPosts(currentPage)} title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[300px]">
          {loading && posts.length > 0 && (
             <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#03c4c9]" />
             </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No articles found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map(post => (
                  <TableRow key={post.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">
                      <div className="truncate max-w-[280px]">{post.title || 'Untitled'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 font-normal">
                        {post.category || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.status === 'published' ? (
                        <Badge className="bg-green-100 text-green-800 border-none font-medium">Published</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-none font-medium">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatBlogDate(post.published_at || post.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {post.status === 'published' && post.slug && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                              <Eye className="w-4 h-4 text-gray-500 hover:text-[#03c4c9]" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/blog/${post.id}/edit`)}>
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(post.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Controls */}
        {totalCount > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, totalCount)} to {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} posts
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchPosts(currentPage - 1)} 
                disabled={currentPage === 1 || loading}
                className="h-8"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchPosts(currentPage + 1)} 
                disabled={currentPage >= totalPages || loading}
                className="h-8"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogManagementPage;