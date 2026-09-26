/* Role roadmaps, roadmap.sh style: a job title, the things you actually learn
   in order, and the certification that attests to it at the end.

   Two rules this file exists to enforce.

   1. NO PRICES HERE. Every roadmap links to the coupon page for its
      certification, and that page is the single source of truth for price.
      Duplicating prices is exactly how the September sale shipped stale
      numbers on sixteen pages, and a roadmap is the worst possible place for
      a wrong price because nobody rebuilds it daily.

   2. `verdict` must be honest, including when the answer is "you do not need
      this". A roadmap where every role conveniently ends in something for sale
      reads as an advert and converts worse than one that says "skip it". The
      credibility IS the conversion mechanism.

   `steps[].c` links a step to a concept id in content/path.mjs; the build fails
   if the id does not exist, so a renamed concept cannot silently orphan a step.
   `cert.page` is a path on rushabhshah.dev. `cert.go` is used only where no
   dedicated page exists yet. */

export const ROLES = [
  {
    id: 'beginner', title: 'Getting in at all', tagline: 'No cloud background, wants a first foothold.',
    job: 'You are not being hired as anything yet. The goal is enough vocabulary and hands-on familiarity that job descriptions stop looking like noise.',
    steps: [
      { t: 'Understand what "cloud native" is claiming', c: 'what-is-cloud-native' },
      { t: 'Learn who the CNCF is and what it hosts', c: 'what-is-cncf' },
      { t: 'Read the landscape as categories, not logos', c: 'reading-the-landscape' },
      { t: 'Get comfortable in a Linux shell. Not optional, and the most common gap' },
      { t: 'Understand the problem containers solve', c: 'why-containers' },
      { t: 'Build and run an image by hand', c: 'image-container-registry' },
      { t: 'Run a single-node cluster locally, break it, fix it' },
    ],
    cert: { name: 'KCNA', full: 'Kubernetes and Cloud Native Associate', page: '/linux-foundation-coupon/kcna/' },
    alt: { name: 'LFCA', full: 'Linux Foundation Certified IT Associate', page: '/linux-foundation-coupon/lfca/' },
    verdict: 'KCNA is the one cert on this list that is genuinely useful without experience, because it certifies vocabulary and vocabulary is what you are missing. It is multiple choice and it will not get you hired on its own. If you cannot yet navigate a shell comfortably, do LFCA first and come back.',
  },
  {
    id: 'k8s-admin', title: 'Kubernetes Administrator', tagline: 'Runs the clusters other people deploy to.',
    job: 'You own the cluster: upgrades, capacity, networking, storage, and the 3am call when scheduling stops working. The job is mostly diagnosis.',
    steps: [
      { t: 'Control plane vs data plane, and what fails when each dies', c: 'control-plane-data-plane' },
      { t: 'Declarative state and the reconciliation loop', c: 'reconciliation' },
      { t: 'The object model you will actually type', c: 'object-model' },
      { t: 'How the kubelet starts a container', c: 'cri' },
      { t: 'How a pod gets an IP and reaches other pods', c: 'cni' },
      { t: 'How a workload gets a disk that outlives it', c: 'csi' },
      { t: 'RBAC, quotas and namespaces as real isolation' },
      { t: 'etcd backup and restore, practised rather than read about' },
      { t: 'Cluster upgrades and node drain without dropping traffic' },
    ],
    cert: { name: 'CKA', full: 'Certified Kubernetes Administrator', page: '/linux-foundation-coupon/cka/' },
    verdict: 'This is the one hiring managers actually check, and unusually for a certification it is worth the money: it is a live terminal against broken clusters, not multiple choice, so passing it is evidence you can do the work rather than describe it. Do not sit it without months of real kubectl time.',
  },
  {
    id: 'k8s-dev', title: 'Application Developer on Kubernetes', tagline: 'Ships services to a cluster someone else runs.',
    job: 'You write the application and everything needed to run it well: probes, config, resource limits, and enough observability to debug your own service at 2am.',
    steps: [
      { t: 'Why containers, from a developer\'s angle', c: 'why-containers' },
      { t: 'Images, layers and why build order matters', c: 'image-container-registry' },
      { t: 'Pods, Deployments and Services', c: 'object-model' },
      { t: 'ConfigMaps, Secrets and the twelve-factor habit' },
      { t: 'Liveness, readiness and startup probes, and how each is misused' },
      { t: 'Resource requests and limits, and what OOMKilled really means' },
      { t: 'Debugging a failing pod from logs and describe output alone' },
      { t: 'Multi-container patterns, sidecars and init containers' },
    ],
    cert: { name: 'CKAD', full: 'Certified Kubernetes Application Developer', page: '/linux-foundation-coupon/ckad/' },
    verdict: 'Narrower than CKA rather than easier. It skips cluster administration and goes deeper on the application layer. Worth it if you deploy to Kubernetes but will never run it; if you might end up owning the cluster, CKA is the better single purchase.',
  },
  {
    id: 'k8s-security', title: 'Kubernetes Security Specialist', tagline: 'Hardens clusters and the supply chain feeding them.',
    job: 'You reduce blast radius: what a compromised pod can reach, what gets admitted, what is signed, and what you can prove afterwards.',
    steps: [
      { t: 'Everything in the administrator path first. CKS requires an active CKA', c: 'control-plane-data-plane' },
      { t: 'Trust boundaries: where the container isolation actually ends', c: 'runtimes' },
      { t: 'Sandboxed runtimes and when namespaces are not enough', c: 'runtimes' },
      { t: 'Admission control and policy as code (OPA, Kyverno)' },
      { t: 'Supply chain: SBOMs, signing and verifying what you run' },
      { t: 'Runtime detection and the audit trail you will need' },
      { t: 'Network policy that actually denies by default', c: 'cni' },
    ],
    cert: { name: 'CKS', full: 'Certified Kubernetes Security Specialist', page: '/linux-foundation-coupon/cks/' },
    alt: { name: 'KCSA', full: 'Kubernetes and Cloud Native Security Associate', page: '/linux-foundation-coupon/kcsa/' },
    verdict: 'CKS carries the strongest security signal in this catalogue and requires an active CKA to sit, so budget for both. KCSA is the multiple-choice associate version: useful as a stepping stone or if you work alongside security rather than in it, but it is not a substitute.',
  },
  {
    id: 'linux', title: 'Linux / Systems Administrator', tagline: 'The layer everything above assumes you already know.',
    job: 'The unglamorous foundation. Almost every cloud native failure eventually bottoms out in a filesystem, a process, a permission or a network route.',
    steps: [
      { t: 'What bare metal and virtualisation actually buy you', c: 'why-containers' },
      { t: 'Namespaces and cgroups: the kernel features containers are made of', c: 'runtimes' },
      { t: 'systemd, journald and service lifecycle' },
      { t: 'Storage: filesystems, mounts, LVM' },
      { t: 'Networking: routes, iptables and nftables, DNS resolution order' },
      { t: 'Users, permissions and capabilities' },
      { t: 'Shell scripting good enough to automate your own work' },
    ],
    cert: { name: 'LFCS', full: 'Linux Foundation Certified System Administrator', page: '/linux-foundation-coupon/lfcs/' },
    verdict: 'Performance-based like CKA, and the most transferable certification here because Linux does not churn. If you are strong on Kubernetes but vague on what the kernel is doing underneath, this closes the gap that eventually shows up in an incident.',
  },
  {
    id: 'observability', title: 'Observability Engineer', tagline: 'Makes systems explain themselves before they fail.',
    job: 'You own the question "what is actually happening", and the harder one, "how would we have known sooner". Metrics, logs and traces are the tools, not the job.',
    steps: [
      { t: 'Why distributed systems need this at all', c: 'why-orchestration' },
      { t: 'Metrics, logs and traces, and what each is bad at' },
      { t: 'Prometheus: the data model, scraping and PromQL' },
      { t: 'Alerting that pages a human only when a human is needed' },
      { t: 'OpenTelemetry as the vendor-neutral collection layer' },
      { t: 'Tracing across service boundaries, and sampling honestly' },
      { t: 'Dashboards people actually read during an incident' },
    ],
    cert: { name: 'PCA', full: 'Prometheus Certified Associate', page: '/linux-foundation-coupon/pca/' },
    alt: { name: 'OTCA', full: 'OpenTelemetry Certified Associate', page: '/linux-foundation-coupon/otca/' },
    verdict: 'Both are multiple choice and neither will get you hired alone. They are worth it as a forcing function: PCA makes you learn PromQL properly, which most people fake for years. Take PCA if you own alerts, OTCA if you own instrumentation, and skip both if you already do this daily and nobody is asking you to prove it.',
  },
  {
    id: 'platform', title: 'Platform Engineer', tagline: 'Builds the paved road other teams ship on.',
    job: 'Your users are other engineers. Success is measured in how rarely they need to understand any of this.',
    steps: [
      { t: 'Why interfaces exist, because you will be designing them', c: 'why-interfaces' },
      { t: 'CRDs and operators as the extension mechanism', c: 'crd-operators' },
      { t: 'Golden paths, templates and self-service provisioning' },
      { t: 'Multi-tenancy that holds under pressure' },
      { t: 'Developer portals and service catalogues (Backstage)' },
      { t: 'Cost and capacity as a platform concern, not an afterthought' },
    ],
    cert: { name: 'CNPE', full: 'Certified Cloud Native Platform Engineer', go: '/go/cnpe/' },
    verdict: 'The newest and most senior of these, and the only one aimed at design judgement rather than operation. Worth it once you are already doing platform work; it is a poor first certification because it assumes everything in the administrator path.',
  },
  {
    id: 'gitops', title: 'GitOps / Delivery Engineer', tagline: 'Makes deployment boring and reversible.',
    job: 'Git is the desired state; a controller makes reality match. Your job is that loop being trustworthy enough that people stop deploying by hand.',
    steps: [
      { t: 'The reconciliation loop, because GitOps is just this with Git as input', c: 'reconciliation' },
      { t: 'Declarative manifests, Helm and Kustomize, and when each hurts' },
      { t: 'Argo CD or Flux: drift detection and sync policy' },
      { t: 'Progressive delivery: canaries and blue/green with real signals' },
      { t: 'Secrets in a Git-driven world, done without leaking them' },
      { t: 'Rollback you have actually rehearsed' },
    ],
    cert: { name: 'CGOA', full: 'Certified GitOps Associate', go: '/go/cgoa/' },
    alt: { name: 'CAPA', full: 'Certified Argo Project Associate', go: '/go/capa/' },
    verdict: 'CGOA covers the principles and is tool-agnostic; CAPA is specifically Argo. Both are associate-level multiple choice. If your shop already runs Argo, CAPA is the more immediately useful of the two, but neither is a hiring signal on the level of CKA.',
  },
  {
    id: 'networking', title: 'Networking / Service Mesh', tagline: 'Owns how anything reaches anything else.',
    job: 'Connectivity, identity and traffic policy between services, plus the debugging that starts with "it works from my pod but not from theirs".',
    steps: [
      { t: 'How pods get addresses and reach each other', c: 'cni' },
      { t: 'Services, kube-proxy and what load balancing means here', c: 'object-model' },
      { t: 'Getting traffic in: Ingress and the Gateway API', c: 'ccm-gateway' },
      { t: 'Service mesh: mTLS, retries, timeouts and the sidecar cost' },
      { t: 'eBPF as an alternative to iptables-based datapaths' },
      { t: 'Debugging DNS, because it is usually DNS' },
    ],
    cert: { name: 'ICA', full: 'Istio Certified Associate', go: '/go/ica/' },
    alt: { name: 'CCA', full: 'Cilium Certified Associate', go: '/go/cca/' },
    verdict: 'Both are tool-specific, so pick the one you actually run rather than the one that sounds better. If you run neither, learn the CNI layer properly first; a mesh certification on top of shaky networking fundamentals is a bad trade.',
  },
  {
    id: 'ai-infra', title: 'AI / Agent Infrastructure', tagline: 'The newest role here, and the least settled.',
    job: 'Running models and agents on the same infrastructure as everything else, plus the new problem of letting a model call your tools without handing it the keys.',
    steps: [
      { t: 'Everything in the developer path. This is not a shortcut around Kubernetes', c: 'object-model' },
      { t: 'GPU scheduling, device plugins and why they are awkward' },
      { t: 'Model serving, batching and autoscaling on expensive hardware' },
      { t: 'MCP: how a model is given tools, and the trust boundary that creates' },
      { t: 'Cost control, because this is where cloud bills go to die' },
    ],
    cert: { name: 'MCPA', full: 'Model Context Protocol Associate', page: '/linux-foundation-coupon/mcpa/' },
    verdict: 'Brand new, launched September 2026, and the first certification against MCP. Beginner level and multiple choice, so treat it as evidence you have thought about the protocol and its trust model, not as a senior credential. Half the exam is runtime behaviour and security, which is the half people get wrong.',
  },
  {
    id: 'finops', title: 'FinOps / Cloud Cost', tagline: 'The role that pays for itself, literally.',
    job: 'Making cloud spend a thing engineering decides deliberately rather than discovers monthly. Part engineering, part accounting, part diplomacy.',
    steps: [
      { t: 'Where the money actually goes: compute, egress, storage, idle' },
      { t: 'Tagging and allocation good enough to answer "whose is this"' },
      { t: 'Rightsizing and autoscaling as a cost lever, not just a reliability one' },
      { t: 'Commitment discounts: reserved capacity and savings plans' },
      { t: 'FOCUS: the standard that makes multi-cloud billing comparable' },
      { t: 'Showback and chargeback without starting a civil war' },
    ],
    cert: { name: 'FOCP', full: 'FinOps Certified Practitioner', page: '/finops-coupon/practitioner/' },
    verdict: 'A different foundation and a different checkout from everything else on this page, so the Linux Foundation code does not apply to it. Genuinely useful if you are the person being asked why the bill went up, and close to useless if nobody has asked you that yet.',
  },
  {
    id: 'kubestronaut', title: 'The completionist', tagline: 'Collecting the full set, deliberately.',
    job: 'Not a job. A recognition programme: hold all five Kubernetes certifications at once for Kubestronaut, or all sixteen for Golden Kubestronaut.',
    steps: [
      { t: 'KCNA and KCSA first: multiple choice, quickest wins' },
      { t: 'CKA next, because CKS cannot be sat without an active one' },
      { t: 'CKAD, while the kubectl muscle memory is fresh' },
      { t: 'CKS last of the five' },
      { t: 'Then the eleven others if you are going for Golden' },
      { t: 'Watch renewal dates. All of them must be active simultaneously' },
    ],
    cert: { name: 'Kubestronaut bundle', full: 'KCNA + KCSA + CKA + CKAD + CKS', page: '/linux-foundation-coupon/kubestronaut/' },
    alt: { name: 'Golden Kubestronaut', full: 'All 16 certifications', page: '/linux-foundation-coupon/golden-kubestronaut/' },
    verdict: 'Be honest with yourself about why. As a learning structure it is excellent, and the bundles cost meaningfully less than buying the exams one at a time. As a hiring signal, the fifth certification adds far less than the first did. If you already hold one or two, the upgrade bundles exist so you are not paying twice.',
  },
];
