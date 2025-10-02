import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ContentType,
  ContentSource,
  ProcessingStatus,
} from "../../../prisma/generated/client";

export async function POST(request: NextRequest) {
  try {
    const { title, text, userId } = await request.json();

    if (!title || !text || !userId) {
      return NextResponse.json(
        { error: "Title, text, and userId are required" },
        { status: 400 }
      );
    }

    // Create content item for text
    const contentItem = await prisma.contentItem.create({
      data: {
        title,
        description: `Direct text input - ${text.length} characters`,
        contentType: ContentType.TEXT,
        source: ContentSource.DIRECT_INPUT,
        status: ProcessingStatus.COMPLETED, // Text doesn't need transcription
        userId,
        processedAt: new Date(),
      },
    });

    // Create "transcription" record with the direct text
    await prisma.transcription.create({
      data: {
        content: text,
        language: "en",
        confidence: 1.0, // Perfect confidence for direct text input
        wordCount: text.split(/\s+/).length,
        contentItemId: contentItem.id,
      },
    });

    return NextResponse.json({
      contentId: contentItem.id,
      message: "Text content processed successfully",
    });
  } catch (error) {
    console.error("Text processing error:", error);
    return NextResponse.json(
      { error: "Failed to process text content" },
      { status: 500 }
    );
  }
}
