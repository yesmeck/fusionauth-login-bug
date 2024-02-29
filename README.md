# reproduce demo for fusionauth login error

## Run the demo

1. `docker-compose up -d`
2. `node index.js`

## Login user immediately after registration

Only the first user can login successfully, the subsequent users will get an error message like this:

```json
{
  "applicationId": [
    {
      "code": "[invalid]applicationId",
      "message": "The [applicationId] property is not valid. No application exists with Id [076d3078-785e-41b7-8566-1accafa55f11]."
    }
  ]
}
```

## Wait for 10 seconds before login

All users can login successfully.
