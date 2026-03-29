import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowLeft, MessageSquare, Send, Image as ImageIcon, Loader2 } from "lucide-react";

export default function Community() {
  const { user, isAuthenticated } = useAuth();
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const { data: comments, isLoading, refetch } = trpc.comment.getApproved.useQuery(undefined);

  const createMutation = trpc.comment.create.useMutation({
    onSuccess: () => {
      toast.success("留言已提交，等待審核後將顯示。");
      setAuthorName("");
      setContent("");
      setPhotos([]);
      refetch();
    },
    onError: (error) => {
      toast.error(`留言提交失敗：${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 3) {
      toast.error("最多只能上傳3張圖片");
      return;
    }
    setPhotos([...photos, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("請輸入留言內容");
      return;
    }

    if (!isAuthenticated && !authorName.trim()) {
      toast.error("請輸入您的暱稱");
      return;
    }

    // 這裡應該先上傳照片到S3
    const photoUrls: string[] = [];

    createMutation.mutate({
      authorName: isAuthenticated ? undefined : authorName,
      content,
      photos: photoUrls.length > 0 ? photoUrls : undefined,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 導航欄 */}
      <nav className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-md">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-lg">紫</span>
                </div>
                <span className="text-xl font-semibold text-foreground">紫砂壺分享中心</span>
              </a>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </a>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <MessageSquare className="w-4 h-4" />
              壺友交流
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">壺友社區</h1>
            <p className="text-muted-foreground text-lg">
              與全球紫砂壺愛好者交流心得，分享收藏故事
            </p>
          </div>

          {/* 發表留言 */}
          <Card className="mb-8 shadow-elegant">
            <CardHeader>
              <CardTitle>發表留言</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isAuthenticated && (
                  <div className="space-y-2">
                    <Label htmlFor="authorName">暱稱 *</Label>
                    <Input
                      id="authorName"
                      placeholder="請輸入您的暱稱"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">留言內容 *</Label>
                  <Textarea
                    id="content"
                    placeholder="分享您的想法、問題或收藏故事..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photos">附加圖片（可選，最多3張）</Label>
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {photos.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`預覽 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        發表留言
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  * 留言將在審核通過後顯示，請文明交流，尊重他人。
                </p>
              </form>
            </CardContent>
          </Card>

          {/* 留言列表 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">社區動態</h2>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/4" />
                          <div className="h-3 bg-muted rounded w-1/6" />
                        </div>
                      </div>
                      <div className="h-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="hover-lift">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {comment.authorName?.charAt(0) || "匿"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">
                              {comment.authorName || "匿名用戶"}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>

                          <p className="text-foreground leading-relaxed mb-3">
                            {comment.content}
                          </p>

                          {comment.photos && comment.photos.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {comment.photos.map((photo, index) => (
                                <div key={index} className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
                                  <img
                                    src={photo}
                                    alt={`圖片 ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">還沒有留言</h3>
                <p className="text-muted-foreground">
                  成為第一個發表留言的壺友吧！
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
