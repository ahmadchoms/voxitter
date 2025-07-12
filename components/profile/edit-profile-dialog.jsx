import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit } from "lucide-react";
import { InputField } from "../forms/input-field";

export function EditProfileDialog({
  user,
  isEditDialogOpen,
  setIsEditDialogOpen,
  register,
  handleSubmit,
  errors,
  updateLoading,
  onSubmit,
}) {
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-300 bg-gray-600/50 hover:bg-gray-600 hover:text-white border-0"
        >
          <Edit className="w-4 h-4" />
          Edit Profil
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            id="full_name"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            defaultValue={user.full_name}
            register={register}
            error={errors.full_name}
            className="bg-gray-800 border-gray-600 text-white"
          />

          <InputField
            id="username"
            label="Username"
            placeholder="Masukkan username"
            defaultValue={user.username}
            register={register}
            error={errors.username}
            className="bg-gray-800 border-gray-600 text-white"
          />

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              defaultValue={user.bio || ""}
              {...register("bio")}
              className="bg-gray-800 border-gray-600 text-white resize-none"
              placeholder="Ceritakan tentang diri Anda"
              rows={3}
            />
            {errors.bio && (
              <p className="text-red-400 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="flex-1 border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600 hover:text-white"
              disabled={updateLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
