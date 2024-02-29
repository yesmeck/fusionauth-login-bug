const { FusionAuthClient } = require("@fusionauth/typescript-client");

const fusionAuthURL = "http://localhost:9011";
const client = new FusionAuthClient('33052c8a-c283-4e96-9d2a-eb1215c69f8f-not-for-prod', fusionAuthURL);

async function createUser() {
  const name = "My Tenant " + Math.random().toString(36).substring(7);
  const email = "user" + Math.random().toString(36).substring(7) + "@example.com";
  const password = "password"

  client.setTenantId(null);

  const { response: { tenant } } = await client.createTenant(null, {
    tenant: {
      name,
      jwtConfiguration: {
        timeToLiveInSeconds: 604800,
      }
    }
  });


  client.setTenantId(tenant.id);

  const { response: { application } } = await client.createApplication(null, {
    application: {
      name: name + " App",
    },
  });

  const { response: { user } } = await client.createUser(null, {
    sendSetPasswordEmail: false,
    user: {
      tenantId: tenant.id,
      email,
      password,
    },
  });

  await client.register(user.id, {
    registration: {
      applicationId: application.id,
    },
  });

  return {
    tenant,
    application,
    email,
    password,
  };
}

(async () => {
  /**
   * login user after registration immediately
   * only the first login attempt succeed
   */
  for (let i = 0; i < 10; i++) {
    try {
      const { tenant, application, email, password } = await createUser();

      console.log("================================================================================")

      console.log("Login attempt", i, "for", {
        tenantId: tenant.id,
        applicationId: application.id,
        email,
        password
      });

      await client.login({
        applicationId: application.id,
        loginId: email,
        password: password,
      });
    } catch (e) {
      if (e.exception) {
        console.error("Login failed", e.exception.fieldErrors);
      } else {
        console.error("Login failed", e);
      }
      continue;
    }
    console.log("Login succeeded");
  }

  console.log("Sleeping for 10 seconds...")

  await new Promise((resolve) => setTimeout(resolve, 10000));

  /**
   * login user after registration after 10 seconds
   */
  for (let i = 0; i < 10; i++) {
    try {
      const { tenant, application, email, password } = await createUser();

      await new Promise((resolve) => setTimeout(resolve, 10000));

      console.log("================================================================================")

      console.log("Login attempt", i, "for", {
        tenantId: tenant.id,
        applicationId: application.id,
        email,
        password
      });

      await client.login({
        applicationId: application.id,
        loginId: email,
        password: password,
      });
    } catch (e) {
      if (e.exception) {
        console.error("Login failed", e.exception.fieldErrors);
      } else {
        console.error("Login failed", e);
      }
      continue;
    }
    console.log("Login succeeded");
  }

})();
