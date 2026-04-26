import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { generateSlug, calculateReadingTime } from '@/lib/blogHelpers';
import { ArrowLeft, Save, Send, Image as ImageIcon, Link as LinkIcon, Loader2, Bold, Italic, List, Heading2, Heading3, UploadCloud, X, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/components/ui/use-toast';
import { BlogContext } from '@/contexts/BlogContext';

// TipTap Integration
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapImage from '@tiptap/extension-image';
import TipTapLink from '@tiptap/extension-link';

const sanitizeFormData = (data) => {
  return {
    title: data?.title || '',
    slug: data?.slug || '',
    excerpt: data?.excerpt || '',
    content: data?.content || '',
    featured_image_url: data?.featured_image_url || '',
    featured_image_alt: data?.featured_image_alt || '',
    category: data?.category || 'Diving',
    tags: Array.isArray(data?.tags) ? data.tags : (typeof data?.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
    author: data?.author || 'Poseidon Diving Team',
    status: data?.status || 'draft',
    seo_title: data?.seo_title || '',
    seo_description: data?.seo_description || '',
    seo_keywords: data?.seo_keywords || '',
    reading_time: data?.reading_time || 0,
    views_count: data?.views_count || 0,
  };
};

const MenuBar = ({ editor, imageUploadRef }) => {
  if (!editor) return null;

  const insertCTA = (type) => {
    let html = '';
    if (type === 'tour') {
      html = '<a href="/booking" style="display: inline-block; background-color: #03c4c9; color: white; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Book Your Tour</a><p></p>';
    } else if (type === 'trip') {
      html = '<a href="/tailor-made" style="display: inline-block; background-color: #2d353b; color: white; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Plan Your Custom Trip</a><p></p>';
    }
    editor.chain().focus().insertContent(html).run();
  };

  return (
    <div className="border border-gray-200 bg-gray-50 rounded-t-md p-2 flex flex-wrap gap-1">
      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-200' : ''}><Bold className="w-4 h-4" /></Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-200' : ''}><Italic className="w-4 h-4" /></Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}><Heading2 className="w-4 h-4" /></Button>

      <div className="w-px h-6 bg-gray-300 mx-1 my-auto"></div>

      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}><List className="w-4 h-4" /></Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}><Quote className="w-4 h-4" /></Button>

      <div className="w-px h-6 bg-gray-300 mx-1 my-auto"></div>

      <Button type="button" variant="ghost" size="sm" onClick={() => {
        const url = window.prompt('URL:');
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }} className={editor.isActive('link') ? 'bg-gray-200' : ''}><LinkIcon className="w-4 h-4" /></Button>

      <Button type="button" variant="ghost" size="sm" onClick={() => imageUploadRef?.current?.click()}><ImageIcon className="w-4 h-4" /></Button>

      <div className="w-px h-6 bg-gray-300 mx-1 my-auto"></div>

      <Button type="button" variant="outline" size="sm" onClick={() => insertCTA('tour')} className="text-[10px] font-bold border-[#03c4c9] text-[#03c4c9] hover:bg-[#03c4c9] hover:text-white px-2">+ TOUR BUTTON</Button>
      <Button type="button" variant="outline" size="sm" onClick={() => insertCTA('trip')} className="text-[10px] font-bold border-[#2d353b] text-[#2d353b] hover:bg-[#2d353b] hover:text-white px-2">+ TRIP BUTTON</Button>
    </div>
  );
};

const BlogEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshBlogData } = useContext(BlogContext);
  const isEditMode = !!id;
  const imageUploadRef = useRef(null);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', featured_image_url: '', featured_image_alt: '',
    category: 'Diving', tags: [], author: 'Poseidon Diving Team', status: 'draft',
    seo_title: '', seo_description: '', seo_keywords: '', reading_time: 0, views_count: 0,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ blockquote: { HTMLAttributes: { class: 'border-l-4 border-[#03c4c9] pl-4 italic text-gray-600 my-4' } } }),
      TipTapImage.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' } }),
      TipTapLink.configure({ openOnClick: false })
    ],
    content: '',
    onUpdate: ({ editor }) => { setFormData(prev => ({ ...prev, content: editor.getHTML() })); },
    editorProps: { attributes: { class: 'prose max-w-none focus:outline-none min-h-[400px] p-4 bg-white border border-gray-200 border-t-0 rounded-b-md text-[#2d353b]' } },
  });

  useEffect(() => { if (isEditMode) fetchPost(); }, [id, editor]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      if (error) throw error;
      const cleanData = sanitizeFormData(data);
      setFormData(cleanData);
      if (cleanData.featured_image_url) setImagePreview(cleanData.featured_image_url);
      if (editor) editor.commands.setContent(cleanData.content || '');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load post.', variant: 'destructive' });
      navigate('/admin/blog');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value || '' };
      if (name === 'title' && (!isEditMode || !prev.slug)) updates.slug = generateSlug(value);
      return { ...prev, ...updates };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({ ...prev, featured_image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUploadInEditor = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && editor) editor.chain().focus().setImage({ src: event.target.result }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (forceStatus = null) => {
    if (!formData.title) return toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
    setSaving(true);
    const cleanData = sanitizeFormData(formData);
    const finalStatus = forceStatus || cleanData.status;
    const payload = { ...cleanData, status: finalStatus, reading_time: calculateReadingTime(cleanData.content), updated_at: new Date().toISOString() };
    delete payload.id; delete payload.created_at;
    try {
      const { error } = isEditMode ? await supabase.from('blog_posts').update(payload).eq('id', id) : await supabase.from('blog_posts').insert([payload]);
      if (error) throw error;
      toast({ title: 'Success', description: 'Post saved successfully' });
      
      // Trigger blog data refresh across all components
      refreshBlogData();
      
      if (!isEditMode) navigate('/admin/blog');
    } catch (error) { 
      console.error('Save error:', error);
      toast({ title: 'Error', description: 'Error saving post', variant: 'destructive' }); 
    }
    finally { setSaving(false); }
  };

  const currentTags = Array.isArray(formData.tags) ? formData.tags.join(', ') : '';

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#03c4c9]" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border sticky top-[72px] z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}><ArrowLeft className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">{isEditMode ? 'Edit Post' : 'New Post'}</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}><Save className="w-4 h-4 mr-2" /> Draft</Button>
          <Button onClick={() => handleSave('published')} disabled={saving} className="bg-[#03c4c9] text-white hover:bg-[#02a8ad]"><Send className="w-4 h-4 mr-2" /> Publish</Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-4 bg-white border">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="config">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <div className="mt-6 bg-white p-6 rounded-xl border">
          <TabsContent value="content" className="space-y-6 m-0">
            <div className="space-y-4">
              <div><Label>Title *</Label><Input name="title" value={formData.title} onChange={handleChange} className="text-lg font-semibold" /></div>
              <div><Label>Slug</Label><Input name="slug" value={formData.slug} onChange={handleChange} className="bg-gray-50 font-mono text-sm" /></div>

              {/* Featured Image Section - Positioned between Slug and Excerpt */}
              <div className="p-5 border rounded-xl bg-gray-50/50">
                <Label className="text-base font-semibold block mb-4">Featured Image</Label>
                {imagePreview ? (
                  <div className="relative h-48 rounded-lg overflow-hidden border mb-4">
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    <Button type="button" variant="destructive" size="sm" onClick={() => { setImagePreview(''); setFormData(p => ({ ...p, featured_image_url: '' })); }} className="absolute top-2 right-2"><X className="w-4 h-4" /></Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="feat-upload" />
                    <Label htmlFor="feat-upload" className="cursor-pointer bg-white px-4 py-2 rounded-md border shadow-sm hover:bg-gray-50 flex items-center gap-2">
                      <UploadCloud className="w-4 h-4" /> Upload Image
                    </Label>
                  </div>
                )}
                <Input name="featured_image_url" value={formData.featured_image_url} onChange={(e) => { setFormData(p => ({ ...p, featured_image_url: e.target.value })); setImagePreview(e.target.value) }} placeholder="Or paste image URL..." className="mt-2" />
                <Input name="featured_image_alt" value={formData.featured_image_alt} onChange={handleChange} placeholder="Alt text for SEO..." className="mt-2" />
              </div>

              <div><Label>Excerpt</Label><Textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} maxLength={160} placeholder="Brief summary of the post..." /></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Category</Label><Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Tips, News, Diving" /></div>
                <div><Label>Tags (comma separated)</Label><Input name="tags" value={currentTags} onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="diving, lagos, ocean" /></div>
              </div>

              <div>
                <Label className="mb-2 block">Post Content</Label>
                <div className="border rounded-md overflow-hidden">
                  <MenuBar editor={editor} imageUploadRef={imageUploadRef} />
                  <input type="file" accept="image/*" onChange={handleImageUploadInEditor} className="hidden" ref={imageUploadRef} />
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 m-0">
            <div><Label>SEO Title</Label><Input name="seo_title" value={formData.seo_title} onChange={handleChange} maxLength={60} placeholder="Optimized title for search engines" /></div>
            <div><Label>Meta Description</Label><Textarea name="seo_description" value={formData.seo_description} onChange={handleChange} rows={3} maxLength={160} placeholder="Brief description for search results" /></div>
            <div><Label>SEO Keywords</Label><Input name="seo_keywords" value={formData.seo_keywords} onChange={handleChange} placeholder="keyword1, keyword2, keyword3" /></div>
          </TabsContent>

          <TabsContent value="config" className="m-0">
            <div className="space-y-4 max-w-sm">
              <Label>Status</Label>
              <RadioGroup value={formData.status} onValueChange={(val) => setFormData(p => ({ ...p, status: val }))} className="flex gap-4">
                <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1">
                  <RadioGroupItem value="draft" id="d1" /> <Label htmlFor="d1">Draft</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1">
                  <RadioGroupItem value="published" id="d2" /> <Label htmlFor="d2">Published</Label>
                </div>
              </RadioGroup>
              <div className="pt-4"><Label>Author</Label><Input name="author" value={formData.author} onChange={handleChange} /></div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="m-0">
            <div className="bg-white max-w-4xl mx-auto shadow-lg rounded-xl overflow-hidden">
              <div className="h-64 relative bg-black">
                <img src={imagePreview || 'https://via.placeholder.com/1200x600'} className="w-full h-full object-cover opacity-70" alt="Hero" />
                <div className="absolute bottom-0 p-8">
                  <span className="bg-[#03c4c9] text-white px-2 py-1 rounded text-xs mb-2 inline-block">{formData.category}</span>
                  <h1 className="text-3xl font-bold text-white">{formData.title || 'Post Title'}</h1>
                </div>
              </div>
              <div className="p-8 prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-500">Content preview...</p>' }} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default BlogEditorPage;