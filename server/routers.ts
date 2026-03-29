import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM, type TextContent, type ImageContent } from "./_core/llm";
// import { storagePut } from "../storage/index"; // 暫時註釋，後續實現文件上傳
import { 
  createTeapot, 
  getTeapotById, 
  getTeapotsByUser, 
  getPublicTeapots,
  getPendingTeapots,
  updateTeapot,
  createClassicTeapot,
  getAllClassicTeapots,
  getClassicTeapotById,
  createAuctionTeapot,
  getAllAuctionTeapots,
  addToCollection,
  getUserCollections,
  removeFromCollection,
  createComment,
  getApprovedComments,
  getPendingComments,
  updateCommentStatus
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 紫砂壺管理
  teapot: router({
    // 創建新壺
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        clayType: z.enum(["purple", "green", "vermilion", "duan", "jiangpo"]),
        claySubtype: z.string().optional(),
        photos: z.object({
          front: z.string().optional(),
          back: z.string().optional(),
          top: z.string().optional(),
          inside: z.string().optional(),
        }),
      }))
      .mutation(async ({ ctx, input }) => {
        await createTeapot({
          ...input,
          userId: ctx.user.id,
          status: "pending",
          isPublic: true,
          aiAnalyzed: false,
          manualCorrected: false,
        });
        return { success: true };
      }),

    // 獲取單個壺詳情
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getTeapotById(input);
      }),

    // 獲取用戶的壺列表
    getMyTeapots: protectedProcedure
      .query(async ({ ctx }) => {
        return await getTeapotsByUser(ctx.user.id);
      }),

    // 獲取公開的壺列表
    getPublic: publicProcedure
      .query(async () => {
        return await getPublicTeapots();
      }),

    // 獲取待審核的壺列表（管理員）
    getPending: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getPendingTeapots();
      }),

    // AI識別泥料
    analyzeClay: protectedProcedure
      .input(z.object({
        photoUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "你是一位專業的紫砂壺鑑定專家。根據提供的紫砂壺照片，分析其泥料類型。請從以下類別中選擇：紫泥（包括老紫泥、底槽清、大水潭紫泥）、綠泥（包括四井本綠、本山綠、大水潭綠泥）、朱泥、段泥（包括白段、青段）、降坡泥（包括紅降坡泥、青降坡泥）。"
            },
            {
              role: "user",
              content: [
                { type: "text" as const, text: "請分析這把紫砂壺的泥料類型，並提供分析理由。" },
                { type: "image_url" as const, image_url: { url: input.photoUrl } }
              ]
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "clay_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  clayType: {
                    type: "string",
                    enum: ["purple", "green", "vermilion", "duan", "jiangpo"],
                    description: "泥料主類型"
                  },
                  claySubtype: {
                    type: "string",
                    description: "泥料子類型，如老紫泥、底槽清等"
                  },
                  confidence: {
                    type: "number",
                    description: "識別信心度（0-100）"
                  },
                  reasoning: {
                    type: "string",
                    description: "分析理由"
                  }
                },
                required: ["clayType", "claySubtype", "confidence", "reasoning"],
                additionalProperties: false
              }
            }
          }
        });

        const result = JSON.parse((response.choices[0]?.message.content as string) || "{}");
        return result;
      }),

    // AI識別工藝
    analyzeCraft: protectedProcedure
      .input(z.object({
        insidePhotoUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "你是一位專業的紫砂壺工藝鑑定專家。根據提供的壺內照片，分析其製作工藝。請從以下類別中選擇：全手工（full_handmade）、手半（semi_handmade）、點搪（slip_casting）、全手工車一刀（wheel_thrown）。"
            },
            {
              role: "user",
              content: [
                { type: "text" as const, text: "請分析這把紫砂壺的製作工藝類型，並提供分析理由。" },
                { type: "image_url" as const, image_url: { url: input.insidePhotoUrl } }
              ]
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "craft_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  craftType: {
                    type: "string",
                    enum: ["full_handmade", "semi_handmade", "slip_casting", "wheel_thrown"],
                    description: "工藝類型"
                  },
                  confidence: {
                    type: "number",
                    description: "識別信心度（0-100）"
                  },
                  reasoning: {
                    type: "string",
                    description: "分析理由"
                  }
                },
                required: ["craftType", "confidence", "reasoning"],
                additionalProperties: false
              }
            }
          }
        });

        const result = JSON.parse((response.choices[0]?.message.content as string) || "{}");
        return result;
      }),

    // AI識別器型
    analyzeShape: protectedProcedure
      .input(z.object({
        frontPhotoUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "你是一位專業的紫砂壺器型鑑定專家。根據提供的紫砂壺正面照片，分析其器型。常見器型包括：石瓢、西施、仿古、掇球、供春、井欄、秦權、周盤、文旦、容天、合歡、漢鐸、洋桶、匏尊、思亭、扁腹、漢瓦、葫蘆、美人肩、柱礎、一粒珠、匏瓜、湯婆、唐羽、線圓、集玉、傳爐、僧帽、四方、雪華、龍頭一捆竹、合菱等。"
            },
            {
              role: "user",
              content: [
                { type: "text" as const, text: "請分析這把紫砂壺的器型類型，並提供分析理由和匹配度分數。" },
                { type: "image_url" as const, image_url: { url: input.frontPhotoUrl } }
              ]
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "shape_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  shapeType: {
                    type: "string",
                    description: "器型名稱"
                  },
                  matchScore: {
                    type: "number",
                    description: "匹配度分數（0-100）"
                  },
                  reasoning: {
                    type: "string",
                    description: "分析理由"
                  }
                },
                required: ["shapeType", "matchScore", "reasoning"],
                additionalProperties: false
              }
            }
          }
        });

        const result = JSON.parse((response.choices[0]?.message.content as string) || "{}");
        return result;
      }),

    // 更新壺信息（包括人工修正）
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        clayType: z.enum(["purple", "green", "vermilion", "duan", "jiangpo"]).optional(),
        claySubtype: z.string().optional(),
        craftType: z.enum(["full_handmade", "semi_handmade", "slip_casting", "wheel_thrown"]).optional(),
        shapeType: z.string().optional(),
        manualCorrected: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const teapot = await getTeapotById(input.id);
        if (!teapot) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (teapot.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const { id, ...updateData } = input;
        await updateTeapot(id, updateData);
        return { success: true };
      }),

    // 審核壺（管理員）
    approve: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["approved", "rejected"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await updateTeapot(input.id, { status: input.status });
        return { success: true };
      }),
  }),

  // 經典作品
  classic: router({
    getAll: publicProcedure.query(async () => {
      return await getAllClassicTeapots();
    }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getClassicTeapotById(input);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        artist: z.string(),
        dynasty: z.string().optional(),
        description: z.string().optional(),
        clayType: z.enum(["purple", "green", "vermilion", "duan", "jiangpo"]).optional(),
        shapeType: z.string().optional(),
        photos: z.array(z.string()),
        referenceUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await createClassicTeapot(input);
        return { success: true };
      }),
  }),

  // 拍賣會作品
  auction: router({
    getAll: publicProcedure.query(async () => {
      return await getAllAuctionTeapots();
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        artist: z.string().optional(),
        auctionHouse: z.string().optional(),
        auctionDate: z.date().optional(),
        estimatedPrice: z.string().optional(),
        finalPrice: z.string().optional(),
        description: z.string().optional(),
        clayType: z.enum(["purple", "green", "vermilion", "duan", "jiangpo"]).optional(),
        shapeType: z.string().optional(),
        photos: z.array(z.string()),
        sourceUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await createAuctionTeapot(input);
        return { success: true };
      }),
  }),

  // 收藏
  collection: router({
    add: protectedProcedure
      .input(z.object({
        teapotId: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await addToCollection(ctx.user.id, input.teapotId, input.notes);
        return { success: true };
      }),

    getMy: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCollections(ctx.user.id);
    }),

    remove: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        await removeFromCollection(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // 留言
  comment: router({
    create: publicProcedure
      .input(z.object({
        authorName: z.string().optional(),
        teapotId: z.number().optional(),
        content: z.string(),
        photos: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await createComment({
          userId: ctx.user?.id,
          authorName: input.authorName,
          teapotId: input.teapotId,
          content: input.content,
          photos: input.photos,
          status: "pending",
        });
        return { success: true };
      }),

    getApproved: publicProcedure
      .input(z.number().optional())
      .query(async ({ input }) => {
        return await getApprovedComments(input);
      }),

    getPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await getPendingComments();
    }),

    review: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["approved", "rejected"]),
        reviewNote: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await updateCommentStatus(input.id, input.status, ctx.user.id, input.reviewNote);
        return { success: true };
      }),
  }),

  // 圖片上傳
  upload: router({
    getUploadUrl: protectedProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // 生成唯一的文件鍵
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const fileKey = `teapots/${ctx.user.id}/${timestamp}-${randomSuffix}-${input.filename}`;
        
        return {
          fileKey,
          uploadUrl: `/api/upload/${fileKey}`,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
