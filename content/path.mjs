/* The path. This is the part that does not exist upstream.
   cncf/glossary defines terms; cncf/landscape lists projects. Neither publishes
   an ORDER, and the order is the whole product: each step may only use
   vocabulary an earlier step has already earned.

   Every concept carries three depths:
     one   - a single sentence, no jargon, readable by someone on their phone
     para  - the mechanism, one paragraph
     deep  - the detail someone studying for KCNA actually needs
   `terms` are slugs into content/glossary.json, rendered as hover definitions.
   `coins` are acronyms this concept introduces; nothing may use an acronym
   before some concept coins it. scripts/build.mjs enforces that. */

export const PARTS = [
  {
    id: 'orientation', num: 0, title: 'Orientation',
    blurb: 'What the words mean, before any technology. Four ideas that make everything after them cheaper to learn.',
    concepts: [
      {
        id: 'what-is-cloud-native', title: 'What "cloud native" actually means',
        one: 'Building software so that it expects to run on machines it does not own, and to survive those machines disappearing.',
        para: 'The phrase is not about being hosted in a cloud. Plenty of cloud-hosted software is not cloud native, and some cloud native software runs in a basement. It describes an assumption: that the underlying computers are disposable, interchangeable and occasionally on fire. Once you assume that, a set of design choices follows almost automatically, and those choices are what the term actually names.',
        deep: 'The most-quoted definition centres on loosely coupled systems that are resilient, manageable and observable, combined with automation that lets engineers make high-impact changes frequently and predictably. The important word is *predictably*. Frequent change is easy; frequent change that does not increase risk is the hard part, and every technology in this guide exists to make some slice of that possible.',
        terms: ['cloud-native-apps', 'cloud-native-tech', 'distributed-apps'],
        coins: [],
      },
      {
        id: 'what-is-cncf', title: 'What the CNCF is, and what it is not',
        one: 'A neutral home that hosts cloud native projects. It does not build them.',
        para: 'The Cloud Native Computing Foundation is part of the Linux Foundation. Its job is custody, not engineering: it holds trademarks, runs governance, funds infrastructure and provides a level playing field so that no single vendor controls a project everyone depends on. The code is still written by maintainers, most of whom are paid by companies with their own interests.',
        deep: 'This distinction explains things that are otherwise confusing. Why does the CNCF "host" Kubernetes rather than own its roadmap? Because hosting is the product. A company can bet its infrastructure on a CNCF project knowing that a single vendor cannot unilaterally relicense it, kill it, or hold it hostage. That guarantee, not any particular technology, is what the foundation sells.',
        terms: [],
        coins: [{ short: 'CNCF', long: 'Cloud Native Computing Foundation', gloss: 'Part of the Linux Foundation. Hosts cloud native projects and holds their trademarks, but does not write their code.' }],
      },
      {
        id: 'reading-the-landscape', title: 'How to read the landscape without drowning',
        one: 'It is a hierarchy pretending to be a wall. Read the category headings and ignore the logos.',
        para: 'landscape.cncf.io shows well over a thousand entries at once, which is why most people close it. But almost nothing in it is a thing you choose; the entries are grouped into categories, and the category is the real unit. You do not pick between two hundred tools, you work out which three categories your problem sits in and then compare a handful inside each.',
        deep: 'A second thing hides in the noise: only a minority of landscape entries are actually CNCF projects. The rest are products and services from member companies that fit the category. Confusing "in the landscape" with "a CNCF project" is the single most common misreading, and it makes the ecosystem look far larger and more chaotic than it is.',
        terms: [],
        coins: [],
      },
    ],
  },
  {
    id: 'containers', num: 1, title: 'The unit: containers',
    blurb: 'Everything above this sits on one idea. Get this part properly and the rest stops being mysterious.',
    concepts: [
      {
        id: 'why-containers', title: 'The problem before containers',
        one: '"It works on my machine" is a deployment strategy, and a bad one.',
        para: 'Software depends on more than its own code: a language runtime, system libraries, configuration, a particular filesystem layout. Historically those lived on the server and were managed separately from the application, so the thing you tested and the thing you ran were never quite the same artefact. Most deployment failure was some version of that gap.',
        deep: 'Virtual machines solved it by shipping the whole operating system, which worked but was heavy: gigabytes per artefact and a minute or more to boot. The insight behind containers is that you rarely need a second kernel, only a second *view* of the filesystem and process space. Keep the kernel, isolate everything above it, and the same guarantee costs megabytes and milliseconds.',
        terms: ['virtual-machine', 'virtualization', 'bare-metal-machine'],
        coins: [],
      },
      {
        id: 'image-container-registry', title: 'Image, container, registry',
        one: 'An image is the recipe, a container is the meal, a registry is the cookbook shelf.',
        para: 'These three get used interchangeably and should not be. An image is an immutable, layered filesystem plus metadata, built once and never changed. A container is a running process started from an image, with its own isolated view of the system. A registry is a server that stores and serves images. One image can start a thousand containers; none of them can alter the image.',
        deep: 'The layering matters more than it first appears. Images are built in stacked read-only layers, each addressed by a content hash, and a running container adds one thin writable layer on top. Two images sharing a base layer store it once, and pulling an image you mostly already have transfers only the difference. Immutability plus content addressing is what makes container distribution fast enough to be practical.',
        terms: ['container-image', 'image-registry', 'container', 'immutable-infrastructure'],
        coins: [],
      },
      {
        id: 'oci', title: 'OCI: the specifications underneath',
        one: 'Three written standards that stop "container" meaning one vendor\'s product.',
        para: 'The Open Container Initiative publishes three specifications: the image spec (what an image is on disk), the runtime spec (how to run one) and the distribution spec (how registries serve them). Because these are written down and implemented by several independent tools, an image built with one tool runs under another and is stored by a third.',
        deep: 'This is the first appearance of a pattern that repeats through the entire ecosystem, and it is worth naming now: **specify the boundary, then let implementations compete behind it.** OCI is why you can build with Podman or Buildah, store in Harbor or a cloud registry, and run under containerd or Podman, without any of those needing to know about the others.',
        terms: [],
        coins: [{ short: 'OCI', long: 'Open Container Initiative', gloss: 'Publishes the image, runtime and distribution specifications that make containers portable between vendors.' }],
      },
      {
        id: 'runtimes', title: 'Runtimes: high-level, low-level, sandboxed',
        one: 'Two layers of program, one that manages containers and one that actually starts them.',
        para: 'A low-level runtime does the narrow job the OCI runtime spec describes: take a bundle on disk, ask the kernel for the right namespaces and cgroups, start the process. runc is the reference implementation. A high-level runtime does everything around that: pull images, manage storage and networking, track lifecycle, and call a low-level runtime when it is time to actually run something. containerd and CRI-O are the common ones.',
        deep: 'Sandboxed runtimes swap out the isolation model for workloads where kernel-level namespaces are not a strong enough boundary. gVisor puts a user-space kernel between the container and the host; Kata Containers gives each container a lightweight virtual machine. Both implement the same OCI runtime interface, so they slot in underneath an unchanged high-level runtime, which is the whole point of having written the spec down.',
        terms: ['runtime', 'container-runtime'],
        coins: [{ short: 'CRI', long: 'Container Runtime Interface', gloss: 'The API Kubernetes uses to talk to a container runtime. CRI-O is named after it. Covered properly in Part 3.' }],
      },
      {
        id: 'docker-is-several-things', title: 'Why "Docker" means four different things',
        one: 'A company, a CLI, a daemon and a file format all share one name, and people mix them up constantly.',
        para: 'Docker popularised containers and for years was the only way most people met them, so the name attached to the whole idea. Today Docker is a company; `docker` is a command-line tool; dockerd is a daemon that builds and runs containers; and a Dockerfile is a build format. Kubernetes never ran "Docker images" as a distinct thing, because there is no such thing: they are OCI images.',
        deep: 'The "Kubernetes deprecates Docker" headlines in 2020 caused real panic and described something narrow. Kubernetes removed dockershim, a compatibility layer that let the kubelet talk to dockerd, because dockerd did not speak the interface Kubernetes wanted. Images kept working, because images were never the issue. The confusion was entirely about the name covering four things at once.',
        terms: [],
        coins: [],
      },
    ],
  },
  {
    id: 'orchestration', num: 2, title: 'Orchestration',
    blurb: 'One container is easy. The interesting problems all start at a few thousand.',
    concepts: [
      {
        id: 'why-orchestration', title: 'What orchestration actually solves',
        one: 'Deciding which machine runs what, and noticing when that stops being true.',
        para: 'Given a fleet of machines and a set of workloads, something has to place each workload somewhere with enough capacity, restart it when it dies, move it when a machine fails, and let other workloads find it once it moves. Doing that by hand works up to about one machine. An orchestrator is the program that does it continuously.',
        deep: 'The scale argument is the one usually given and it is the weaker one. The stronger argument is uniformity: once placement, restart, discovery and rollout are handled the same way for every workload, operational knowledge stops being per-application. That is why orchestration pays off well below the scale at which it is strictly necessary.',
        terms: ['container-orchestration', 'cluster', 'scalability'],
        coins: [],
      },
      {
        id: 'control-plane-data-plane', title: 'Control plane and data plane',
        one: 'One set of components decides what should happen; another set carries it out.',
        para: 'The control plane holds the desired state and makes decisions: the API server takes every request, etcd stores the state, the scheduler chooses where new work goes, and controllers watch for drift. The data plane is the machines actually running your workloads, each with a kubelet taking instructions and a network proxy wiring up traffic.',
        deep: 'The split explains the failure modes. If the control plane is down, running workloads keep running: they are just processes on a node, and nothing is checking on them. What stops is *change* — no new deployments, no rescheduling, no reaction to a node dying. Control plane outages are therefore rarely immediate outages, which is why they are sometimes noticed late.',
        terms: ['cluster', 'nodes', 'kubernetes'],
        coins: [],
      },
      {
        id: 'reconciliation', title: 'Declarative state and the reconciliation loop',
        one: 'You describe the end state you want; a loop keeps making reality match it, forever.',
        para: 'This is the single most important idea in the ecosystem. You do not issue commands like "start three copies". You write down that three copies should exist, and a controller compares that against what exists, then acts to close the gap. It never stops doing this. Kill a copy and the loop notices and replaces it, not because anything was watching for your action, but because the gap reappeared.',
        deep: 'Understanding this converts most Kubernetes confusion into something predictable. It is why deleting a pod that a Deployment owns does not achieve anything; why editing a resource by hand gets silently reverted; and why the answer to "how do I make it do X" is almost always "change the declared state, not the running system". Every controller, every operator and all of GitOps is this loop with a different source of desired state.',
        terms: ['declarative-configuration', 'idempotence', 'kubernetes'],
        coins: [],
      },
      {
        id: 'object-model', title: 'The object model you actually use',
        one: 'A handful of resource types cover most of what people deploy.',
        para: 'A Pod is one or more containers scheduled together sharing a network identity, and it is the smallest thing Kubernetes places. A ReplicaSet keeps N pods alive. A Deployment manages ReplicaSets to give you rolling updates and rollbacks. A Service gives a stable address to a changing set of pods. A Namespace partitions all of it for isolation and quota.',
        deep: 'Almost nobody creates Pods directly, and the reason is the reconciliation loop: a bare Pod has no controller, so when it dies nothing recreates it. You create a Deployment so that something owns the gap. The same reasoning explains StatefulSets for workloads needing stable identity and storage, DaemonSets for one-per-node agents, and Jobs for work that is supposed to finish.',
        terms: ['pod', 'service', 'kubernetes'],
        coins: [],
      },
      {
        id: 'crd-operators', title: 'CRDs and operators',
        one: 'Teach the cluster a new noun, then write a loop that knows how to run it.',
        para: 'A Custom Resource Definition adds a new resource type to the Kubernetes API, so the cluster can store and serve objects it was never built to understand. On its own that is just typed storage. An operator is the other half: a controller that watches those objects and runs the same reconciliation loop against them.',
        deep: 'The pattern encodes operational knowledge as software. A database operator does not merely install a database; it knows how to take backups, perform failover and run a version upgrade safely, and it does those things continuously rather than when someone remembers. That is why operators are the usual answer for stateful workloads, where the interesting work is all in the operations rather than the install.',
        terms: ['custom-resource-definition', 'operator-pattern', 'controller'],
        coins: [{ short: 'CRD', long: 'Custom Resource Definition', gloss: 'Adds a new resource type to the Kubernetes API so the cluster can manage objects it was not built to understand.' }],
      },
    ],
  },
  {
    id: 'interfaces', num: 3, title: 'The interfaces',
    blurb: 'This is the acronym wall, and it is far smaller than it looks. Four letters-and-an-I names, one idea behind all of them.',
    concepts: [
      {
        id: 'why-interfaces', title: 'Why any of these exist',
        one: 'Kubernetes refuses to pick a winner, so it defines a socket and lets vendors build plugs.',
        para: 'Kubernetes needs to run containers, connect them and give them storage. It could have shipped one implementation of each and been done. Instead it specifies a contract for each and ships none of them, so any vendor meeting the contract works without Kubernetes changing. Every acronym in this part is one of those contracts.',
        deep: 'This is the same pattern OCI introduced one part ago, applied at a different boundary, and it is the mechanism by which the CNCF stays vendor-neutral in practice rather than only in its charter. It also explains why the ecosystem looks crowded: a well-specified interface invites many implementations, and all of them show up on the landscape.',
        terms: ['abstraction', 'application-programming-interface'],
        coins: [],
      },
      {
        id: 'cri', title: 'CRI, the Container Runtime Interface',
        one: 'How the kubelet asks something to run a container, without caring what that something is.',
        para: 'Every node runs a kubelet, and the kubelet does not start containers itself. It speaks CRI, a gRPC API, to whatever runtime is installed. containerd and CRI-O both implement it. Swap one for the other and the kubelet does not notice.',
        deep: 'This is exactly what the "Kubernetes deprecates Docker" story was about. dockerd did not speak CRI, so Kubernetes shipped dockershim to translate, then removed that maintenance burden once CRI-native runtimes were widespread. Nothing about images changed. The interface, not the image format, was the thing being tidied up.',
        terms: [],
        coins: [],
      },
      {
        id: 'cni', title: 'CNI, the Container Network Interface',
        one: 'How a container gets an IP address and a route to everything else.',
        para: 'When a pod is created something must give it a network identity and wire it into a network where every other pod is reachable. CNI is the contract for that: a plugin is invoked at pod creation and teardown, and it is responsible for the address and the plumbing. Calico, Cilium and Flannel are implementations.',
        deep: 'Kubernetes mandates the outcome and specifies almost nothing about the method: every pod gets its own IP, and all pods can reach each other without NAT. How you achieve that is entirely the plugin\'s business, which is why implementations differ so wildly. Some use overlay tunnels, some program the underlying network directly, and Cilium uses eBPF to do the work inside the kernel rather than through iptables rules.',
        terms: [],
        coins: [{ short: 'CNI', long: 'Container Network Interface', gloss: 'The contract a networking plugin implements to give each pod an IP address and connectivity. Calico, Cilium and Flannel are implementations.' }],
      },
      {
        id: 'csi', title: 'CSI, the Container Storage Interface',
        one: 'How a workload gets a disk that outlives the container using it.',
        para: 'Containers are disposable, but data usually is not. CSI is the contract a storage system implements so that Kubernetes can provision a volume, attach it to whichever node needs it, and mount it into a pod, without Kubernetes containing any storage-vendor code.',
        deep: 'CSI was deliberately specified to be orchestrator-agnostic rather than Kubernetes-specific, which is why the same driver can serve other orchestrators. Before it, storage integrations lived in the Kubernetes tree itself, which meant a driver bug needed a Kubernetes release to fix. Moving them out is the same architectural move as CRI: shrink the core, specify the edge.',
        terms: ['persistent-volume', 'persistent-storage', 'stateful-apps'],
        coins: [{ short: 'CSI', long: 'Container Storage Interface', gloss: 'The contract a storage system implements so Kubernetes can provision, attach and mount volumes without vendor code in its core.' }],
      },
      {
        id: 'ccm-gateway', title: 'CCM and Gateway API, the other two boundaries',
        one: 'One for talking to a cloud provider, one for getting traffic in from outside.',
        para: 'The Cloud Controller Manager is where cloud-specific logic lives: creating load balancers, labelling nodes with their region, handling instances that no longer exist. Gateway API is the newer specification for routing external traffic into a cluster, designed to replace Ingress with something expressive enough for real routing and role-aware enough for shared clusters.',
        deep: 'Both are the same move again. CCM exists so that Kubernetes releases are not coupled to cloud provider release cycles. Gateway API exists because Ingress was underspecified, so every controller invented incompatible annotations to cover the gaps, which quietly destroyed the portability the abstraction was supposed to provide. The lesson repeats: an interface that is too thin gets extended in incompatible ways until it is no longer an interface.',
        terms: ['service-mesh'],
        coins: [{ short: 'CCM', long: 'Cloud Controller Manager', gloss: 'Holds the cloud-provider-specific logic (load balancers, node metadata) so the Kubernetes core stays provider-neutral.' }],
      },
    ],
  },
];

/* Parts 4 to 6 are structured but not yet written, so the nav and the build can
   already reason about the whole shape. Writing them is v1.1. */
export const PLANNED = [
  { id: 'layers', num: 4, title: 'The layers above', blurb: 'Networking, storage, observability, delivery, security, platform. Roughly 24 projects named in the context where you would actually reach for them.' },
  { id: 'governance', num: 5, title: 'Governance and people', blurb: 'Board, TOC and staff; TAGs; the maturity ladder; how a project joins and graduates; the contributor ladder; Code of Conduct; events; certifications.' },
  { id: 'reference', num: 6, title: 'Reference', blurb: 'Searchable glossary, the landscape map, and an acronym index.' },
];
