import useSettings from '@/lib/hooks/useSettings';
import FormField from './custom/FormField';
import { Button } from './ui/button';

export default function ChangePasswordForm() {
  const {
    registerChangePass,
    changePassword,
    handleSubmitChangePass,
    errorsChangePass,
    isChangePassSubmitting,
  } = useSettings();
  return (
    <div className="max-w-lg">
      <h2 className="mb-4 font-bold text-3xl text-primary">Change password</h2>
      <form
        className="flex flex-col gap-5 w-full"
        onSubmit={handleSubmitChangePass(changePassword)}
      >
        <FormField
          placeholder="Enter your old password"
          id="oldPassword"
          type="password"
          label="Old password"
          errors={errorsChangePass.oldPassword}
          registration={registerChangePass('oldPassword', { required: "Required field" })}
          isPasswordField
        />
        <FormField
          placeholder="Enter your new password"
          id="newPassword"
          type="password"
          label="New password"
          errors={errorsChangePass.newPassword}
          registration={registerChangePass('newPassword', { required: true })}
          isPasswordField
        />
        <FormField
          placeholder="Confirm your new password"
          id="confirmPassword"
          type="password"
          label="Confirm your password"
          registration={registerChangePass('confirmPassword', { required: true })}
          errors={errorsChangePass.confirmPassword}
          isPasswordField
        />
        <Button className="cursor-pointer" disabled={isChangePassSubmitting}>
          {isChangePassSubmitting ? 'Processing...' : 'Change password'}
        </Button>
      </form>
    </div>
  );
}
