import { db } from "@/infrastructure/db/index.js";
import { DbClientType, DbPoolType } from "@/infrastructure/db/type.js";
import {
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors/index.js";
import { requirePermission } from "@/shared/utils/require-permission.js";
import { UserSession } from "@repo/contracts/dto/auth";
import {
  AnnouncementDetailDTO,
  AnnouncementDetailEncodeDTO,
  AnnouncementFormDTO,
} from "@repo/contracts/dto/announcement";
import { updateAnnouncementTx } from "../repositories/update.repository.js";
import { getAnnouncementDetailByIdTx } from "../repositories/get-announcement-one.repository.js";

export const updateAnnouncementService = async ({
  form,
  id,
  user,
  tx = db,
}: {
  form: AnnouncementFormDTO;
  id: AnnouncementDetailDTO["id"];
  user: UserSession;
  tx?: DbPoolType | DbClientType;
}): Promise<AnnouncementDetailEncodeDTO> => {
  requirePermission({
    user,
    resource: "announcements",
    action: "update",
    ctx: {},
  });
  try {
    const result = await tx.transaction(async (trx) => {
      const announcement = await updateAnnouncementTx({
        tx,
        form,
        id,
      });

      if (!announcement) {
        throw new NotFoundError("announcements");
      }

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
    if (err.constructor.name == "NotFoundError")
      throw new NotFoundError("announcements");

    if (err.code === "23505" && err.detail?.includes("title")) {
      throw new ValidationError("Title is already taken");
    }
    throw new BaseError(500, "Internal Server Error");
  }
};
