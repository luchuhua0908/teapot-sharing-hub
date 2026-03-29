import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  MessageSquare,
  Image as ImageIcon
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("teapots");

  const { data: pendingTeapots, refetch: refetchTeapots } = trpc.teapot.getPending.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: pendingComments, refetch: refetchComments } = trpc.comment.getPending.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const approveTeapotMutation = trpc.teapot.approve.useMutation({
    onSuccess: () => {
      toast.success("審核成功");
      refetchTeapots();
    },
    onError: (error) => {
      toast.error(`審核失敗：${error.message}`);
    },
  });

  const reviewCommentMutation = trpc.comment.review.useMutation({
    onSuccess: () => {
      toast.success("審核成功");
      refetchComments();
    },
    onError: (error) => {
      toast.error(`審核失敗：${error.message}`);
    },
  });

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>權限不足</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              您沒有訪問管理後台的權限
            </p>
            <Link href="/">
              <Button className="w-full">返回首頁</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const clayTypeLabels: Record<string, string> = {
    purple: "紫泥",
    green: "綠泥",
    vermilion: "朱泥",
    duan: "段泥",
    jiangpo: "降坡泥",
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
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              管理員
            </Badge>
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

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">審核管理後台</h1>
          <p className="text-muted-foreground">
            審核用戶上傳的紫砂壺和留言內容
          </p>
        </div>

        {/* 統計卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">待審核壺</p>
                  <p className="text-3xl font-bold">{pendingTeapots?.length || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">待審核留言</p>
                  <p className="text-3xl font-bold">{pendingComments?.length || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">總待審核</p>
                  <p className="text-3xl font-bold">
                    {(pendingTeapots?.length || 0) + (pendingComments?.length || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 審核內容 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="teapots">
              紫砂壺 ({pendingTeapots?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="comments">
              留言 ({pendingComments?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* 紫砂壺審核 */}
          <TabsContent value="teapots" className="mt-6">
            {pendingTeapots && pendingTeapots.length > 0 ? (
              <div className="space-y-6">
                {pendingTeapots.map((teapot) => (
                  <Card key={teapot.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="w-full md:w-48 aspect-square bg-muted relative overflow-hidden rounded-lg flex-shrink-0">
                        {teapot.photos?.front ? (
                          <img
                            src={teapot.photos.front}
                            alt={teapot.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                            {clayTypeLabels[teapot.clayType]}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{teapot.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              上傳時間：{formatDate(teapot.createdAt)}
                            </p>
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="w-3 h-3" />
                            待審核
                          </Badge>
                        </div>

                        {teapot.description && (
                          <p className="text-foreground mb-4">{teapot.description}</p>
                        )}

                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                          {teapot.claySubtype && (
                            <div>
                              <p className="text-sm text-muted-foreground">泥料子類</p>
                              <p className="font-medium">{teapot.claySubtype}</p>
                            </div>
                          )}
                          {teapot.shapeType && (
                            <div>
                              <p className="text-sm text-muted-foreground">器型</p>
                              <p className="font-medium">{teapot.shapeType}</p>
                            </div>
                          )}
                          {teapot.craftType && (
                            <div>
                              <p className="text-sm text-muted-foreground">工藝</p>
                              <p className="font-medium">{teapot.craftType}</p>
                            </div>
                          )}
                          {teapot.aiAnalyzed && (
                            <div>
                              <Badge variant="secondary" className="gap-1">
                                AI已識別
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="default"
                            className="flex-1 gap-2"
                            onClick={() => approveTeapotMutation.mutate({ id: teapot.id, status: "approved" })}
                            disabled={approveTeapotMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4" />
                            通過
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1 gap-2"
                            onClick={() => approveTeapotMutation.mutate({ id: teapot.id, status: "rejected" })}
                            disabled={approveTeapotMutation.isPending}
                          >
                            <XCircle className="w-4 h-4" />
                            拒絕
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">沒有待審核的壺</h3>
                <p className="text-muted-foreground">
                  所有上傳的紫砂壺都已審核完成
                </p>
              </Card>
            )}
          </TabsContent>

          {/* 留言審核 */}
          <TabsContent value="comments" className="mt-6">
            {pendingComments && pendingComments.length > 0 ? (
              <div className="space-y-4">
                {pendingComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
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
                            <Badge variant="outline" className="gap-1 ml-auto">
                              <Clock className="w-3 h-3" />
                              待審核
                            </Badge>
                          </div>

                          <p className="text-foreground leading-relaxed">
                            {comment.content}
                          </p>

                          {comment.photos && comment.photos.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-3">
                              {comment.photos.map((photo, index) => (
                                <div key={index} className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
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

                      <div className="flex gap-3">
                        <Button
                          variant="default"
                          className="flex-1 gap-2"
                          onClick={() => reviewCommentMutation.mutate({ id: comment.id, status: "approved" })}
                          disabled={reviewCommentMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4" />
                          通過
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1 gap-2"
                          onClick={() => reviewCommentMutation.mutate({ id: comment.id, status: "rejected" })}
                          disabled={reviewCommentMutation.isPending}
                        >
                          <XCircle className="w-4 h-4" />
                          拒絕
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">沒有待審核的留言</h3>
                <p className="text-muted-foreground">
                  所有留言都已審核完成
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
