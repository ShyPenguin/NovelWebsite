import { db } from "@/infrastructure/db/index.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { BaseError, ValidationError } from "@/shared/errors/index.js";
import { requirePermission } from "@/shared/utils/require-permission.js";
import { UserSession } from "@repo/contracts/dto/auth";
import {
  AnnouncementDetailEncodeDTO,
  AnnouncementFormDTO,
} from "@repo/contracts/dto/announcement";
import { createAnnouncementTx } from "../repositories/create.repository.js";
import { getAnnouncementDetailByIdTx } from "../repositories/get-announcement-one.repository.js";

export const createAnnouncementService = async ({
  form,
  user,
  tx = db,
}: {
  form: AnnouncementFormDTO;
  user: UserSession;
  tx?: DbExecTypes;
}): Promise<AnnouncementDetailEncodeDTO> => {
  requirePermission({
    user,
    resource: "announcements",
    action: "create",
    ctx: {},
  });

  try {
    const result = await tx.transaction(async (trx) => {
      const announcement = await createAnnouncementTx({
        tx: trx,
        form: {
          ...form,
          authorId: user.id,
        },
      });

      const detailed = await getAnnouncementDetailByIdTx(
        {
          id: announcement.id,
        },
        trx,
      );

      return detailed!;
    });

    return result;
  } catch (err: any) {
    if (err.code === "23505" && err.detail?.includes("title")) {
      throw new ValidationError("Title is already taken");
    }
    throw new BaseError(500, "Internal Server Error");
  }
};
