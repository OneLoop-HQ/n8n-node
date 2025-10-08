# n8n-nodes-feather

This is an n8n community node. It lets you use Feather AI in your n8n workflows.

Feather AI is a conversational AI platform for building voice and text agents.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Install n8n-node globally

```sh
npm install --global @n8n/node-cli
```

2. Build

```sh
n8n-node build
```

3. Start n8n dev server

```sh
n8n-node dev
```

3. Run Linter

```sh
n8n-node lint
```

## Operations

* Get Workflows
* Dispatch single phone call
* Create Workflow Execution
* Cancel Workflow Execution

## Credentials

API Key can be issued using the dashboard.

## Usage

* Workflows are time and condition bound cadences of multiple calls that operate on a schedule. You must create one on the dashboard
* Each lead becomes an instance of a single workflow execution
* In order to dispatch single phone calls or workflow execution, please attach a phone number in the 'Telephony' tab in the dashboard to the agent. This agent can then be attached to the workflow.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Feather Docs](https://docs.featherhq.com)

## Version history

* Version 1.0.0
