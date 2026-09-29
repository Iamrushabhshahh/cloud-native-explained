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
        one: 'Writing software that assumes the machine under it will disappear, and does not care when it does.',
        para: 'The phrase has nothing to do with being hosted in a cloud. Plenty of software sitting in AWS is not cloud native. Some cloud native software runs in a basement. What it describes is an assumption you make before you write a line of code: the machine is disposable. It will be replaced, rescheduled or killed, probably at 2am, probably by something automated. Once you accept that, a whole set of decisions makes itself. That is the part the buzzword is pointing at.',
        deep: 'The official definition talks about loosely coupled systems, resilience, observability and automation that lets you make big changes often. Fine. But the word doing the work is **predictably**. Shipping often is easy. Shipping often without your risk going up with your deploy count is the hard bit, and every tool in this guide exists to buy back a slice of that. When you read the landscape later, that is the question to hold: which part of *change without fear* does this thing solve?',
        terms: ['cloud-native-apps', 'cloud-native-tech', 'distributed-apps'],
        coins: [],
      },
      {
        id: 'what-is-cncf', title: 'What the CNCF is, and what it is not',
        one: 'A neutral home for cloud native projects. It does not write the code.',
        para: 'The Cloud Native Computing Foundation sits under the Linux Foundation. Its job is custody, not engineering. It holds the trademarks, runs the governance, pays for the CI, and makes sure no single vendor can quietly take ownership of something the rest of the industry now depends on. The code is still written by maintainers, and most of those maintainers are paid by companies with their own roadmaps. Both things are true at once, and it is worth holding them together.',
        deep: 'This clears up a question that confuses almost everyone at first: why does the CNCF *host* Kubernetes instead of owning its direction? Because hosting is the product. I can put a lending platform on a CNCF project and know that no vendor wakes up one morning, relicenses it, and bills me. Look at what happened elsewhere in open source when that protection was missing. The guarantee is the thing being sold here. The technology is almost incidental.',
        terms: [],
        coins: [{ short: 'CNCF', long: 'Cloud Native Computing Foundation', gloss: 'Part of the Linux Foundation. Hosts cloud native projects and holds their trademarks, but does not write their code.' }],
      },
      {
        id: 'reading-the-landscape', title: 'How to read the landscape without drowning',
        one: 'It is a hierarchy pretending to be a wall. Read the category headings. Ignore the logos.',
        para: 'Open landscape.cncf.io and you get well over a thousand logos in one screen. Most people close the tab. I have watched people do it at meetups in Ahmedabad, and the reaction is always the same: this is too big, I am too late. You are not. Almost nothing on that page is a choice you have to make. The entries sit in categories, and the category is the real unit. You never pick between two hundred tools. You work out which two or three boxes your problem lives in, then compare four things inside each box.',
        deep: 'One more thing the wall hides. Most entries on that page are not CNCF projects at all. They are products and services from member companies that happen to fit the category. "It is on the landscape" and "it is a CNCF project" are completely different claims, and treating them as the same is the most common mistake I see. It also makes the ecosystem look about four times more chaotic than it actually is.',
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
        one: '"It works on my machine" is a deployment strategy. It is a bad one.',
        para: 'Your code is never the whole story. It needs a language runtime, some system libraries, config, a filesystem laid out a particular way. For years all of that lived on the server and was managed by someone else, on a different schedule, which meant the thing you tested and the thing you shipped were never quite the same artefact. Almost every deployment failure I have seen traces back to some version of that gap.',
        deep: 'Virtual machines closed the gap by shipping the entire operating system with the app. It worked, and it cost you gigabytes per artefact and a minute or more to boot. The insight behind containers is that you almost never need a second kernel. You need a second view of the filesystem and the process tree. Keep the kernel, isolate everything above it, and the same guarantee costs megabytes and starts in milliseconds.',
        terms: ['virtual-machine', 'virtualization', 'bare-metal-machine'],
        coins: [],
      },
      {
        id: 'image-container-registry', title: 'Image, container, registry',
        one: 'An image is the recipe. A container is the meal. A registry is the shelf you keep recipes on.',
        para: 'People use these three words interchangeably and they should not. An image is immutable: layered, built once, never changed. A container is a running process started from an image, with its own isolated view of the system. A registry is a server that stores images and hands them out. One image can start a thousand containers and none of them can touch it. If you only remember one thing, remember that images are read-only and containers are not.',
        deep: 'The layering is the clever part and it is easy to skip past. Images are stacked read-only layers, each addressed by the hash of its contents, and a running container puts one thin writable layer on top. Two images that share a base store it once. Pulling an image you mostly already have moves only the difference. That combination, immutability plus content addressing, is the reason pulling a 900MB image over a hotel wifi takes fifteen seconds the second time. It is also why your Dockerfile order matters: put the things that change least at the top.',
        terms: ['container-image', 'image-registry', 'container', 'immutable-infrastructure'],
        coins: [],
      },
      {
        id: 'oci', title: 'OCI: the specifications underneath',
        one: 'Three written standards that stop the word "container" meaning whatever one vendor says it means.',
        para: 'The Open Container Initiative publishes three specs: the image spec (what an image is on disk), the runtime spec (how you run one) and the distribution spec (how registries hand them over). Because those are written down and implemented independently several times over, an image you build with one tool runs under another and is stored by a third, and nobody has to negotiate.',
        deep: 'Notice the shape of this, because it repeats through the entire ecosystem and it is the single most useful pattern to carry forward: **specify the boundary, then let implementations fight it out behind it**. OCI is why you can build with Podman, store in Harbor, and run under containerd, with none of those three knowing the others exist. When you get to Part 3 and hit a wall of acronyms, this is the same idea wearing different letters.',
        terms: [],
        coins: [{ short: 'OCI', long: 'Open Container Initiative', gloss: 'Publishes the image, runtime and distribution specifications that make containers portable between vendors.' }],
      },
      {
        id: 'runtimes', title: 'Runtimes: high-level, low-level, sandboxed',
        one: 'Two layers of program: one manages containers, the other actually starts them.',
        para: 'A low-level runtime does the narrow job the OCI runtime spec describes. Take a bundle off disk, ask the kernel for the right namespaces and cgroups, start the process. runc is the reference implementation and it is smaller than you would expect. A high-level runtime does everything around that: pulls images, sorts out storage and networking, tracks lifecycle, and calls a low-level runtime when it is finally time to run something. containerd and CRI-O are the two you will meet.',
        deep: 'Sandboxed runtimes swap out the isolation model for workloads where kernel namespaces are not a strong enough wall. gVisor puts a user-space kernel between the container and the host. Kata gives each container a lightweight virtual machine. The thing worth noticing: both implement the same OCI runtime interface, so they drop in underneath an unchanged high-level runtime. That is the spec earning its keep. You can change your security posture without changing anything above it.',
        terms: ['runtime', 'container-runtime'],
        coins: [{ short: 'CRI', long: 'Container Runtime Interface', gloss: 'The API Kubernetes uses to talk to a container runtime. CRI-O is named after it. Covered properly in Part 3.' }],
      },
      {
        id: 'docker-is-several-things', title: 'Why "Docker" means four different things',
        one: 'A company, a CLI, a daemon and a file format all answer to the same name. People mix them up constantly.',
        para: 'Docker made containers usable and for years it was the only way most of us met them, so the name stuck to the whole idea. Today Docker is a company. `docker` is a command-line tool. dockerd is a daemon that builds and runs things. A Dockerfile is a build format. Kubernetes never ran "Docker images" as a separate category, because there is no such thing. They are OCI images.',
        deep: 'The "Kubernetes is deprecating Docker" headlines in 2020 caused genuine panic, and I still get asked about it at meetups years later. What actually happened was narrow: Kubernetes removed dockershim, a translation layer that let the kubelet talk to dockerd, because dockerd did not speak the interface Kubernetes wanted. Your images kept working. Your images were never the issue. The whole scare came from one name covering four things, and nobody saying which one was being deprecated.',
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
        one: 'Deciding which machine runs what, and noticing the moment that stops being true.',
        para: 'Give me a fleet of machines and a pile of workloads and something has to place each one somewhere with enough room, restart it when it dies, move it when a machine fails, and let everything else find it after it moves. Doing that by hand works up to about one machine. An orchestrator is the program that does it continuously and does not get bored.',
        deep: 'Scale is the usual argument and it is the weaker one. The stronger one is uniformity. Once placement, restarts, discovery and rollouts work the same way for every workload, operational knowledge stops being per-application. A new engineer learns one set of verbs instead of twelve. That is why orchestration pays off well below the scale at which anyone would call it necessary, and why small teams often benefit more than large ones.',
        terms: ['container-orchestration', 'cluster', 'scalability'],
        coins: [],
      },
      {
        id: 'control-plane-data-plane', title: 'Control plane and data plane',
        one: 'One set of components decides what should happen. Another set carries it out.',
        para: 'The control plane holds the desired state and makes the decisions: the API server takes every request, etcd stores the state, the scheduler picks where new work lands, controllers watch for drift. The data plane is the machines actually running your stuff, each with a kubelet taking orders and a proxy wiring up traffic. Two planes, two failure modes, and mixing them up will cost you during an incident.',
        deep: 'The split is exactly what explains the failure modes. If your control plane is down, everything already running keeps running. Those are just processes on a node and nothing is checking on them. What stops is **change**: no deploys, no rescheduling, no reaction to a node dying. So a control plane outage is rarely an immediate outage. It is a slow one, and it is frequently noticed late, which is worse.',
        terms: ['cluster', 'nodes', 'kubernetes'],
        coins: [],
      },
      {
        id: 'reconciliation', title: 'Declarative state and the reconciliation loop',
        one: 'You write down the end state you want. A loop keeps making reality match it, forever.',
        para: 'This is the single most important idea here and everything else is downstream of it. You do not issue commands like "start three copies". You declare that three copies should exist, and a controller compares that to what exists and closes the gap. It never stops. Kill one and it comes back, not because anything was watching you, but because the gap reappeared and the loop ran again.',
        deep: 'Once this lands, most Kubernetes confusion turns into something predictable. It is why deleting a pod a Deployment owns achieves nothing. It is why your hand-edit gets silently reverted twenty seconds later. It is why the answer to "how do I make it do X" is nearly always "change what you declared, not what is running". Every controller, every operator, and the whole of GitOps is this loop with a different source of truth for the desired state. Learn it once, and four other things stop needing to be learned.',
        terms: ['declarative-configuration', 'idempotence', 'kubernetes'],
        coins: [],
      },
      {
        id: 'object-model', title: 'The object model you actually use',
        one: 'A handful of resource types cover most of what anyone actually deploys.',
        para: 'A Pod is one or more containers scheduled together sharing a network identity, and it is the smallest thing Kubernetes will place. A ReplicaSet keeps N pods alive. A Deployment manages ReplicaSets so you get rolling updates and rollbacks. A Service gives a stable address to a set of pods that keeps changing underneath it. A Namespace slices all of that up for isolation and quota. That is most of it.',
        deep: 'Almost nobody creates a bare Pod, and the reconciliation loop tells you why: a bare Pod has no controller, so when it dies nothing brings it back. You create a Deployment so that something owns the gap. The same logic gives you the rest of the zoo. StatefulSets for workloads that need stable identity and storage. DaemonSets for one-per-node agents. Jobs for work that is supposed to finish. Each one exists because a different thing needed owning.',
        terms: ['pod', 'service', 'kubernetes'],
        coins: [],
      },
      {
        id: 'crd-operators', title: 'CRDs and operators',
        one: 'Teach the cluster a new noun, then write a loop that knows how to run it.',
        para: 'A Custom Resource Definition adds a new type to the Kubernetes API, so the cluster can store and serve objects it was never built to understand. On its own that is just typed storage with good manners. An operator is the other half: a controller that watches those objects and runs the same reconciliation loop against them.',
        deep: 'What the pattern really does is turn operational knowledge into software. A database operator does not just install a database. It knows how to take a backup, fail over, and run a version upgrade without losing data, and it does those things continuously instead of when somebody remembers. That is why operators are the usual answer for stateful workloads: the install was never the hard part, and the interesting work all lives in the operations.',
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
        para: 'Kubernetes has to run containers, connect them, and give them storage. It could have shipped one implementation of each and been done by lunchtime. Instead it writes down a contract for each and ships none of them, so any vendor meeting the contract works without Kubernetes changing a line. Every acronym in this part is one of those contracts, and there are fewer than you think.',
        deep: 'This is the OCI pattern from Part 1, applied at a different seam, and it is how the CNCF stays vendor-neutral in practice instead of only in its charter. It also explains why the landscape looks so crowded. A well-specified interface is an open invitation, every vendor accepts it, and all of them end up on the same page as logos. The crowding is a symptom of the thing working.',
        terms: ['abstraction', 'application-programming-interface'],
        coins: [],
      },
      {
        id: 'cri', title: 'CRI, the Container Runtime Interface',
        one: 'How the kubelet asks something to run a container, without caring what that something is.',
        para: 'Every node runs a kubelet, and the kubelet does not start containers itself. It speaks CRI, a gRPC API, to whatever runtime is installed. containerd implements it. CRI-O implements it. Swap one for the other and the kubelet does not notice, which is the entire point.',
        deep: 'This is what the "Kubernetes deprecates Docker" story was actually about. dockerd did not speak CRI, so Kubernetes shipped dockershim to translate, then removed that maintenance burden once CRI-native runtimes were everywhere. Nothing about image formats changed. The interface was being tidied up, not the images, and a badly worded release note cost the community about six months of confused blog posts.',
        terms: [],
        coins: [],
      },
      {
        id: 'cni', title: 'CNI, the Container Network Interface',
        one: 'How a container gets an IP address and a route to everything else.',
        para: 'When a pod is created, something has to give it a network identity and wire it into a network where every other pod is reachable. CNI is the contract for that. A plugin gets invoked at pod creation and teardown and is responsible for the address and the plumbing. Calico, Cilium and Flannel are three implementations that go about it in completely different ways.',
        deep: 'Kubernetes mandates the outcome and says almost nothing about the method: every pod gets its own IP, and all pods can reach each other without NAT. How you achieve that is the plugin\'s business, which is why implementations differ so wildly. Some build overlay tunnels. Some program the underlying network directly. Cilium uses eBPF to do the work inside the kernel instead of through a growing pile of iptables rules. Worth knowing before you debug one: the failure modes are completely different, and [DNS is usually where it surfaces](/blog/dns-storm-eai-again/).',
        terms: [],
        coins: [{ short: 'CNI', long: 'Container Network Interface', gloss: 'The contract a networking plugin implements to give each pod an IP address and connectivity. Calico, Cilium and Flannel are implementations.' }],
      },
      {
        id: 'csi', title: 'CSI, the Container Storage Interface',
        one: 'How a workload gets a disk that outlives the container using it.',
        para: 'Containers are disposable. Data usually is not. CSI is the contract a storage system implements so Kubernetes can provision a volume, attach it to whichever node needs it, and mount it into a pod, without a single line of storage-vendor code living in Kubernetes itself.',
        deep: 'CSI was deliberately written to be orchestrator-agnostic, not Kubernetes-specific, which is why the same driver serves other schedulers. Before it existed, storage integrations lived in the Kubernetes tree, so fixing a driver bug meant waiting for a Kubernetes release. Moving them out is the same architectural move as CRI: shrink the core, specify the edge, let the people who actually own the storage ship on their own schedule.',
        terms: ['persistent-volume', 'persistent-storage', 'stateful-apps'],
        coins: [{ short: 'CSI', long: 'Container Storage Interface', gloss: 'The contract a storage system implements so Kubernetes can provision, attach and mount volumes without vendor code in its core.' }],
      },
      {
        id: 'ccm-gateway', title: 'CCM and Gateway API, the other two boundaries',
        one: 'One boundary for talking to a cloud provider, one for getting traffic in from outside.',
        para: 'The Cloud Controller Manager is where cloud-specific logic lives: creating load balancers, labelling nodes with their region, cleaning up after instances that no longer exist. Gateway API is the newer spec for routing external traffic into a cluster, built to replace Ingress with something expressive enough for real routing and aware enough of roles to work on a shared cluster.',
        deep: 'Both are the same move again. CCM exists so Kubernetes releases are not chained to cloud provider release cycles. Gateway API exists because Ingress was underspecified, so every controller invented its own annotations to fill the gaps, and those annotations were incompatible. The portability the abstraction promised quietly evaporated. There is a lesson in that worth carrying: an interface that is too thin gets extended in incompatible directions until it stops being an interface at all.',
        terms: ['service-mesh'],
        coins: [{ short: 'CCM', long: 'Cloud Controller Manager', gloss: 'Holds the cloud-provider-specific logic (load balancers, node metadata) so the Kubernetes core stays provider-neutral.' }],
      },
    ],
  },
  {
    id: 'layers', num: 4, title: 'The layers above',
    blurb: 'Six jobs that sit on top of the interfaces, and the projects you would actually reach for in each. Named in context, not as a list to memorise.',
    concepts: [
      {
        id: 'networking-mesh', title: 'Networking and service mesh',
        one: 'Getting packets between pods is solved. Deciding what should be allowed, retried or encrypted is not.',
        para: 'Your [[cni|CNI]] plugin already gives every pod an address and a route. A mesh is what you add when that is not enough: mutual TLS between services so traffic is encrypted and identified, retries and timeouts applied consistently instead of reimplemented in six languages, and traffic splitting so you can send 5% of requests to a new version. Istio and Linkerd do this with a sidecar proxy next to each pod. Cilium does much of it in the kernel with eBPF and no sidecar.',
        deep: 'The honest version: a mesh is a lot of machinery, and plenty of teams adopt one before they have the problem it solves. The question worth asking is whether you currently have retry logic, timeout logic and TLS handling copy-pasted across services in different languages, drifting apart. If yes, a mesh pays for itself. If you have four services and one language, it is a second control plane to operate for benefits you could get from a shared library. Start with Gateway API for ingress and add a mesh when the pain is real.',
        terms: ['service-mesh', 'service-proxy', 'sidecar-container'],
        coins: [{ short: 'mTLS', long: 'mutual TLS', gloss: 'Both sides of a connection present a certificate, so services prove who they are to each other rather than only the server proving it to the client.' }],
      },
      {
        id: 'storage-layer', title: 'Storage',
        one: 'Somebody has to decide what happens to your data when the pod holding it is rescheduled.',
        para: 'Above [[csi|CSI]] sit the systems that actually hold bytes. Rook runs Ceph inside your cluster. Longhorn gives you replicated block storage from the disks already in your nodes. OpenEBS does container-attached storage. MinIO serves an S3-compatible object API. Each solves a different shape of problem, and the shape matters more than the feature list.',
        deep: 'Two questions decide most of this, and almost nobody asks them in order. First: does this data need to survive the cluster, or only the pod? Those are very different requirements, and the second is much cheaper. Second: are you running on a cloud that already has good managed storage? If you are, running your own distributed storage inside Kubernetes is a large operational commitment you are choosing rather than being forced into. Storage is the one layer where "boring and managed" is usually the correct engineering answer.',
        terms: ['persistent-storage', 'persistent-volume', 'stateful-apps'],
        coins: [],
      },
      {
        id: 'observability-layer', title: 'Observability',
        one: 'Not three pillars. One question: can you find out what is happening without shipping new code?',
        para: 'Prometheus scrapes and stores metrics and gives you PromQL to ask questions of them. OpenTelemetry is the vendor-neutral way to produce traces, metrics and logs so you are not locked into whoever you picked first. Grafana draws it. Loki holds logs, Tempo holds traces, Jaeger traces too, Fluentd and Fluent Bit move logs around. Cortex, Thanos and Mimir exist because a single Prometheus eventually is not enough.',
        deep: 'The "three pillars" framing is popular and slightly misleading, because it makes you feel done once you have all three. You are not done when you have metrics, logs and traces. You are done when someone paged at 2am can answer "what changed and what is it touching" in a few minutes. I have written up [an incident where every dashboard was green and the cause was DNS](/blog/dns-storm-eai-again/), a resource nobody had a graph for. The gap is almost never a missing pillar. It is a missing question nobody thought to ask in advance.',
        terms: ['observability', 'monitoring', 'distributed-tracing'],
        coins: [{ short: 'SLO', long: 'service level objective', gloss: 'A target for how reliable something should be, stated as a number, so "is this acceptable" has an answer instead of an argument.' }],
      },
      {
        id: 'delivery-layer', title: 'Delivery and GitOps',
        one: 'Git holds the desired state. A controller in the cluster makes reality match it.',
        para: 'This is the [[reconciliation|reconciliation loop]] again with Git as the source of truth. Argo CD and Flux both watch a repository and apply what they find, then keep applying it. Helm packages manifests into charts with values you can override. Kustomize layers patches over a base without templating. Argo Rollouts and Flagger do canary and blue-green releases with real signals deciding whether to continue.',
        deep: 'The thing GitOps actually buys you is not automation. It is that your cluster stops being a place where state accumulates from forgotten kubectl commands. Every change has an author, a review and a revert. The cost is real too: secrets get awkward, and the day a controller is syncing something you urgently need to change by hand, you will feel it. Sealed Secrets and External Secrets Operator exist because this problem is universal, and neither is free of trade-offs.',
        terms: ['gitops', 'continuous-delivery', 'declarative-configuration'],
        coins: [],
      },
      {
        id: 'security-layer', title: 'Security and the supply chain',
        one: 'Two separate problems: what a running workload can reach, and whether you can prove what you are running.',
        para: 'At runtime: OPA and Kyverno enforce policy at admission so a non-conforming workload never starts. Falco watches for suspicious behaviour once things are running. SPIFFE and SPIRE give workloads cryptographic identity, which is what [[mTLS|mTLS]] needs underneath it. On the supply chain side: sigstore signs artefacts, in-toto attests to how they were built, and an SBOM records what is actually inside an image.',
        deep: 'Supply chain security got serious attention after a run of incidents where the compromise was upstream of everyone affected, and the honest summary is that most organisations are still at step one. Step one is not signing. Step one is knowing what you run: which images, built from what, pulled from where. An SBOM nobody reads is still more useful than not having one, because the day a CVE lands in a library you did not know you shipped, the difference between an afternoon and a fortnight is whether that inventory exists.',
        terms: ['zero-trust-architecture', 'policy-as-code', 'shift-left'],
        coins: [{ short: 'SBOM', long: 'software bill of materials', gloss: 'A machine-readable inventory of everything inside an artefact, so you can answer "do we ship this vulnerable library" without guessing.' }],
      },
      {
        id: 'platform-layer', title: 'Platform and developer experience',
        one: 'The layer whose users are other engineers, and whose success is measured in how little they need to know.',
        para: 'Backstage gives you a developer portal and a service catalogue. Crossplane lets you provision cloud infrastructure through the Kubernetes API using [[crd-operators|custom resources]]. Knative handles serverless workloads and scale-to-zero. KEDA scales on queue depth and other event sources rather than CPU. Together these are the pieces most internal platforms are assembled from.',
        deep: 'Platform engineering goes wrong in a specific and predictable way: the platform team builds the abstraction they find interesting instead of the one their users are stuck on. The test I would apply is whether a new engineer can ship a service to production on day two without reading your documentation twice. If the answer is no, adding Backstage does not fix it. The paved road has to be genuinely easier than going around it, or people go around it, and then you have a platform and a shadow platform.',
        terms: ['platform-engineering', 'serverless', 'auto-scaling'],
        coins: [],
      },
    ],
  },
  {
    id: 'governance', num: 5, title: 'Governance and people',
    blurb: 'Who decides what, how a project moves up, and how you get from reading this to having commit rights. The part almost no guide covers, and the part that decides whether a project is safe to depend on.',
    concepts: [
      {
        id: 'who-decides', title: 'Who actually decides things',
        one: 'Three bodies, three completely different jobs, and confusing them is the usual mistake.',
        para: 'The Governing Board handles money, marketing and membership. It does not decide technical direction. The Technical Oversight Committee does: it accepts projects, moves them between maturity levels, and defines what cloud native means in practice. CNCF staff run the events, the infrastructure and the programmes. Members pay to fund it, and paying more does not buy technical control, which is the arrangement the whole thing depends on.',
        deep: 'That separation is not bureaucratic decoration, it is the product. A company can put its infrastructure on a CNCF project because no amount of platinum membership lets a vendor overrule the TOC on technical direction. When you evaluate any open source foundation, this is the structure to look for first, and its absence is the thing that has bitten organisations before.',
        terms: [],
        coins: [{ short: 'TOC', long: 'Technical Oversight Committee', gloss: 'The elected body that accepts CNCF projects, promotes them between maturity levels and defines the technical scope. Separate from the Governing Board, which handles money.' }],
      },
      {
        id: 'tags', title: 'TAGs, and where the work actually happens',
        one: 'Working groups that do the technical legwork the TOC cannot do alone.',
        para: 'Technical Advisory Groups are where domain expertise lives. As of now there are five: Developer Experience, Infrastructure, Operational Resilience, Security and Compliance, and Workloads Foundation. They review projects applying for incubation or graduation, publish guidance, and run working groups on specific problems. They are open, and turning up to a TAG call is one of the lowest-friction ways into the community that exists.',
        deep: 'Two things worth knowing. First, this structure has been reorganised before: there used to be more TAGs with narrower scopes, and they were consolidated. Any guide telling you the old list confidently is out of date, which is a decent reason to check cncf/toc rather than trust a blog post, including this one. Second, TAG review is a real gate. When a project applies to graduate, a TAG reads it properly, and that review is public. If you want to know whether a project is genuinely healthy, those reviews are better evidence than its star count.',
        terms: [],
        coins: [{ short: 'TAG', long: 'Technical Advisory Group', gloss: 'An open working group with domain expertise that advises the TOC, reviews projects and publishes guidance. Five currently exist.' }],
      },
      {
        id: 'maturity', title: 'Sandbox, Incubating, Graduated',
        one: 'Three levels that tell you how much of someone else\'s judgement you are borrowing.',
        para: 'Sandbox is early: the CNCF is giving a project a neutral home and some infrastructure, not endorsing it. Incubating means real adopters and a functioning contributor base. Graduated means it has been through full due diligence, has a security audit, documented governance, and enough independent maintainers that no single company can steer it. Archived means it stopped, and that is a normal outcome rather than a failure.',
        deep: 'Read the level as a statement about risk, not quality. Plenty of excellent software sits in Sandbox, and the level is telling you how much scrutiny has happened so far, not how good the code is. What it should change is the questions you ask. For a Graduated project, someone has already checked the governance and the bus factor for you. For a Sandbox project, that job is yours, and the honest move is to check whether more than one company pays the maintainers before you build on it.',
        terms: [],
        coins: [],
      },
      {
        id: 'graduating', title: 'How a project actually graduates',
        one: 'A public application, a due diligence review, and a vote. It takes months.',
        para: 'A project applies, and the application is an issue anyone can read. It has to show adopters using it in production, documented governance covering how maintainers are added and removed, vendor neutrality of project direction, a completed security audit, and a Due Diligence Review that a TAG works through in public. Then the TOC votes. Graduated projects also now commit to an annual governance health check, because governance decays quietly after the vote.',
        deep: 'The part worth borrowing even if you never apply: the requirement to document a complete maintainer lifecycle, and then demonstrate you have used it. Not "we have a governance file", but "maintainers have actually been added and removed by this process". That distinction catches a specific failure mode, the project with a beautiful written ladder that nobody has climbed in five years. It is a good question to ask of any dependency, CNCF or not.',
        terms: [],
        coins: [],
      },
      {
        id: 'contributor-ladder', title: 'How you get commit rights',
        one: 'Contributor, reviewer, approver, maintainer. The rungs have different names per project and the shape is the same.',
        para: 'You start by sending changes. After enough of them, someone proposes you as a reviewer, which usually means your review counts formally even though you cannot merge. Approver or committer comes next, then maintainer, which carries a vote on direction. Kubernetes writes this down in OWNERS files. Other projects use a MAINTAINERS.md or a community repo. The path is documented far more often than people assume.',
        deep: 'The advice nobody gives: reviewing other people\'s pull requests is a faster and far less crowded route than writing code. Every project has more code arriving than attention to review it, and someone who consistently triages issues and leaves useful review comments becomes visible quickly, because they are solving the maintainers\' actual bottleneck. Writing a feature makes more work for a maintainer before it makes less. Reviewing does the opposite from day one.',
        terms: [],
        coins: [],
      },
      {
        id: 'community-events', title: 'Code of Conduct, events and certifications',
        one: 'The parts that decide whether the community is somewhere you want to spend time.',
        para: 'The CNCF Code of Conduct applies across projects, events and channels, and it is enforced rather than decorative. KubeCon and CloudNativeCon are the big conferences; Kubernetes Community Days are the smaller regional ones, run by local organisers, and they are usually the better first talk. There are certifications too, from KCNA at the entry level through the performance-based CKA, CKAD and CKS.',
        deep: 'If you are anywhere outside the usual conference cities, the local event is the higher-leverage one. I helped bring a KCD to Gujarat and organise Grafana & Friends in Ahmedabad, and the pattern is consistent: the room is full of people who cannot easily fly to a KubeCon, the bar to speak is lower, and the connections are more durable because you will see the same people next quarter. Start there. The certifications are covered properly in the roadmaps further down, including the ones I would tell you to skip.',
        terms: [],
        coins: [],
      },
    ],
  },

];

/* What is left. Parts 0 to 5 are written; the map is the remaining piece. */
export const PLANNED = [
  { id: 'map', num: 6, title: 'The landscape map', blurb: 'An interactive view of the categories and where projects sit in them. The glossary and the acronym index below are already here; the map is the piece still to build.' },
];
