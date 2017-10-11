# Profile Quick Start Guide
## Step 1: Create and configure a YaaS account'

This section explains how to create a YaaS account, an organization, and a project.

### Create a YaaS account

To create a YaaS account, follow these steps:
1. Go to the <a href="https://yaas.io">YaaS main page</a>.
2. Select **Register for free** and follow the steps provided in the instructions to complete the registration.

### Create an organization

When your registration is complete, you can create your own organization.

> If you wish to start using SAP Hybris Profile, creating an organization is mandatory.

To set up your organization, follow these steps:
1. Sign in to the https://builder.yaas.io using your YaaS account.
2. Select **Create your own organization**.
3. Provide the name of your organization.
4. Select your country of origin.
5. Click **Try for free** to create a non-commercial organization.

### Create a project

To start using SAP Hybris Profile, you need a project, also known as a tenant. Follow these steps to set up your project:
1. In the Builder, select your organization and click **Create your first project**.
2. Complete the **Display Name** and **Identifier** fields to define your project. Optionally, provide the description of your project.
3. Click **Save** to create your own project.

## Step 2: Subscribe to packages

To use SAP Hybris Profile as described in this document, subscribe your project to the following packages:
1. Profile Core Services
2. Profile Services for Commerce

To subscribe to the Profile Core Services and Profile Services for Commerce packages, follow these steps:
1. In the Builder, select Your Organization > Your Project.
2. Navigate to Administration > Subscriptions.
3. Click Subscribe. The <a href="https://market.yaas.io">YaaS Market</a> opens.
4. Find the Profile Core Services and Profile Services for Commerce packages.
5. To subscribe to the packages, click on the icons representing each, and select Subscribe now.
6. Select a project to subscribe to the packages, and click Continue.
7. Review your order and click Subscribe now.

## Step 3: Set up a simplified storefront

To start using SAP Hybris Profile for the purpose described in this document, you need a storefront. For your convenience, it is recommended that you download and install a simplified storefront version created specially to introduce you to the basic SAP Hybris Profile functionality. The simplified storefront project is located <a href="https://github.com/hybris/yaas-storefront-profile-quickstart/tree/SAP_Hybris_Profile_Quickstart">here</a>.

To download and install the simplified storefront, and parametrize it with your tenant, execute the following commands. Replace the **{tenant}** parameter with your tenant identifier.

> You must have npm and Git installed locally. For more information about installing Git.

```
git clone -b SAP_Hybris_Profile_Quickstart https://github.com/hybris/yaas-storefront-profile-quickstart.git
cd yaas-storefront-profile-quickstart
npm install
npm start -- --pid={tenant}
```

If you are located in the EU region, modify the last command to look as follows:

```
npm start -- --pid={tenant} --region=eu
```

After executing these commands, open the storefront in your browser by clicking the following link: <a href="http://localhost:9000">http://localhost:9000</a>.

> Use this storefront to send basic events such as `PageViewEvent` and `ProductDetailPageViewEvent` to SAP Hybris Profile, track the events in the Trace Explorer, and see the visual representation of the graph changes caused by the events in the Graph Explorer. For more complex operations, use the [YaaS Storefront](https://github.com/SAP/yaas-storefront). For more details about the YaaS Storefront, and how to set it up, see the <a href="https://devportal.yaas.io/gettingstarted/">Getting Started</a> guide.


## Step 4: Send events 

Now that the simplified storefront is installed locally on your machine and ready to use, you can send events to SAP Hybris Profile just by clicking on the storefront.

> The simplified storefront supports two event types only: `PageViewEvent` and `ProductDetailPageViewEvent`.

Interactions with the storefront create events. Open or refresh the storefront website to create a `PageViewEvent`, or click on the product of your choice to create a `ProductDetailPageViewEvent`. The enrichers contained within the **Profile Services for Commerce** package that your tenant is subscribed to react to these events, and introduce changes to the graph, for example by creating nodes or relationships.


## Step 5: Track events

You can track the events sent from the storefront to SAP Hybris Profile in the Trace Explorer. Tracking allows you to collect details about the exact time of calls between services, and the duration of specific operations. Additionally, it allows you to detect any latency problems.

> In the simplified storefront version, tracing is enabled by default. Therefore, no action from you is required to activate event tracking.

To navigate to the Trace Explorer, click a **contextTraceId** link that appears at the top of the screen each time the storefront sends an event to SAP Hybris Profile.

## Step 6: View the graph changes in the Graph Explorer

The events that you send to SAP Hybris Profile from your storefront trigger the enrichers. Depending on the event type, the triggered enrichers introduce various changes to the profile graph.

For example, by clicking on a product in the storefront, you send the `ProductDetailPageViewEvent` to SAP Hybris Profile. This event triggers the specified enricher, which modifies the graph database by creating nodes and/or relationships, such as a `VIEWED` relationship between the `Session` and the `Product` nodes.

Follow these instructions to see a visual representation of the graph modifications associated with the Profile node.
1. Go to the Trace Explorer to see the initial logs from context adapters that pre-process the event sent from the storefront before dispatching it to the enrichers.
2. In the **Context Transition** component of the Trace Explorer, click one of the displayed links, which represent a given **contextTraceId**. Each storefront event triggers various enrichers. What you see is a list of enricher-generated logs resulting from the storefront activity.
3. Find the log with a message about node creation that displays the schema `nodes/commerce/Session`. The log indicates that an enricher created a node defined by the schema `nodes/commerce/Session`.
4. Click the `nodes/commerce/Session` link to go to the **Graph Explorer** and view the created nodes and relations in a visualized form.
5. Find the node **Identity**, and double-click it. Double clicking loads more data dynamically.
6. See the node for **Profile**. Hover your mouse over the node to display the node's details, or click the node to display them under the graph.