# Profile QuickStart storefront
## Description
This project aims to introduce the user to working with the Profile system by showing the user how actions such as page enter, or product view are processed by the system. This project is based on the [YaaS Storefront](https://github.com/SAP/yaas-storefront), but it does not use the commerce packages, so it does not need any additional configuration before start. The Tracing Debug mode is enabled by default, which makes it possible to track the events sent to the system. 
## Documentation
To learn more about how to start working with the Profile system, follow this guide: https://github.com/hybris/yaas-storefront-profile-quickstart/blob/SAP_Hybris_Profile_Quickstart/Quickstart.md
## Running
First, install the project dependencies.
```
npm install
```
Next, assuming that you have a tenant created, start the application with the following command:
```
npm start -- --pid=<tenant>
```
where `<tenant>` is your tenant identifier.


If your tenant is created in the EU region, you should start the app with:
```
npm start -- --pid=<tenant> --region=eu 
 ```
 
If your tenant is placed on the STAGE environment, you should start the app with:
```
npm start -- --pid=<tenant> --env=stage 
 ```

## Using
SAP Hybris Profile Toolbox should show links to the:
- Consent UI
- Profile Visualization UI
- Profile Explorer
- Tracing Explorer

Events are send when you view the product, select category, or visit the youtube video in the "You ma also like" section. 