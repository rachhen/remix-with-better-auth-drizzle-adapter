import { MetaFunction } from "@remix-run/node";

import { Tabs } from "~/components/ui/tabs2";
import { SignIn } from "~/features/auth/components/sign-in";
import { SignUp } from "~/features/auth/components/sign-up";

export const meta: MetaFunction = () => {
  return [{ title: "Sign In | Better Auth" }];
};

function SignInPage() {
  return (
    <div className="w-full">
      <div className="flex items-center flex-col justify-center w-full md:py-10">
        <div className="md:w-[400px]">
          <Tabs
            tabs={[
              {
                title: "Sign In",
                value: "sign-in",
                content: <SignIn />,
              },
              {
                title: "Sign Up",
                value: "sign-up",
                content: <SignUp />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
