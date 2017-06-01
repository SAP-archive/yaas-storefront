# Profile QuickStart storefront
## Description
This project aims to introduce the user to working with the Profile system by showing the user how actions such as page enter, or product view are processed by the system. This project is based on the [YaaS Storefront](https://github.com/SAP/yaas-storefront), but it does not use the commerce packages, so it does not need any additional configuration before start. The Tracing Debug mode is enabled by default, which makes it possible to track the events sent to the system. 
## Documentation
To learn more about how to start working with the Profile system, follow this guide: https://devportal.yaas.io/solutions/saphybrisprofile/index.html#Quickstartguide
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
npm run start-eu -- --pid=<tenant> --region=eu 
 ```

## Using
Tracing debug bar should show a link to the Tracing UI. Click a product to create a "Product View" event, and get the new link. The generated links are also visible in the browser developer console.