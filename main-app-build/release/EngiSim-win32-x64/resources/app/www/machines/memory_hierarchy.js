export function createMemoryHierarchy(THREE) {
    const group = new THREE.Group();

    const parts = [
        { name: 'CPU Core', description: 'The main processing unit that executes instructions.' },
        { name: 'L1 Instruction Cache', description: 'Extremely fast memory holding instructions for the CPU.' },
        { name: 'L1 Data Cache', description: 'Extremely fast memory holding data the CPU is currently working with.' },
        { name: 'L2 Cache', description: 'Slightly slower and larger than L1, typically dedicated to a single core.' },
        { name: 'L3 Shared Cache', description: 'Slower and much larger cache shared among multiple cores.' },
        { name: 'Memory Controller', description: 'Manages the flow of data going to and from the RAM.' },
        { name: 'Main Memory (RAM)', description: 'The primary storage for data and programs currently in use.' },
        { name: 'TLB', description: 'Translation Lookaside Buffer, caches recent virtual to physical address translations.' },
        { name: 'Page Table Register', description: 'Points to the memory location of the active page table.' },
        { name: 'System Bus', description: 'The communication pathway connecting the memory controller to RAM.' }
    ];

    // Create materials
    const matCPU = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
    const matL1 = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
    const matL2 = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const matL3 = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 });
    const matMC = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.6 });
    const matRAM = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.7 });
    const matTLB = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5 });
    const matPTR = new THREE.MeshStandardMaterial({ color: 0x14b8a6, roughness: 0.5 });
    const matBus = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.2 });

    // 1. CPU Core
    const cpuGeo = new THREE.BoxGeometry(2, 1, 2);
    const cpu = new THREE.Mesh(cpuGeo, matCPU);
    cpu.position.set(0, 5, 0);
    group.add(cpu);

    // 2. L1 Instruction Cache
    const l1iGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const l1i = new THREE.Mesh(l1iGeo, matL1);
    l1i.position.set(-1.5, 3.5, 0);
    group.add(l1i);

    // 3. L1 Data Cache
    const l1dGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const l1d = new THREE.Mesh(l1dGeo, matL1);
    l1d.position.set(1.5, 3.5, 0);
    group.add(l1d);

    // 4. L2 Cache
    const l2Geo = new THREE.BoxGeometry(3, 1, 1);
    const l2 = new THREE.Mesh(l2Geo, matL2);
    l2.position.set(0, 2, 0);
    group.add(l2);

    // 5. L3 Shared Cache
    const l3Geo = new THREE.BoxGeometry(4, 1.5, 2);
    const l3 = new THREE.Mesh(l3Geo, matL3);
    l3.position.set(0, 0, 0);
    group.add(l3);

    // 6. Memory Controller
    const mcGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
    const mc = new THREE.Mesh(mcGeo, matMC);
    mc.position.set(0, -2, 0);
    group.add(mc);

    // 7. Main Memory (RAM)
    const ramGeo = new THREE.BoxGeometry(6, 0.5, 2);
    const ram = new THREE.Mesh(ramGeo, matRAM);
    ram.position.set(0, -5, 0);
    group.add(ram);

    // 8. TLB
    const tlbGeo = new THREE.BoxGeometry(1, 1, 1);
    const tlb = new THREE.Mesh(tlbGeo, matTLB);
    tlb.position.set(0, 3.5, -1.5);
    group.add(tlb);

    // 9. Page Table Register
    const ptrGeo = new THREE.BoxGeometry(1, 0.5, 1);
    const ptr = new THREE.Mesh(ptrGeo, matPTR);
    ptr.position.set(3, 3.5, 0);
    group.add(ptr);

    // 10. System Bus
    const busGeo = new THREE.BoxGeometry(0.2, 2, 0.2);
    const bus = new THREE.Mesh(busGeo, matBus);
    bus.position.set(0, -3.5, 0);
    group.add(bus);

    // Add a data packet for animation
    const packetGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const packetMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00 });
    const packet = new THREE.Mesh(packetGeo, packetMat);
    group.add(packet);

    const animation = (time) => {
        // Define a cycle for the data packet
        const cycleDuration = 4; // seconds
        const t = (time % cycleDuration) / cycleDuration;
        
        // Path: CPU(0,5,0) -> L1D(1.5,3.5,0) -> L2(0,2,0) -> L3(0,0,0) -> MC(0,-2,0) -> RAM(0,-5,0)
        const waypoints = [
            new THREE.Vector3(0, 5, 0),
            new THREE.Vector3(1.5, 3.5, 0),
            new THREE.Vector3(0, 2, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -2, 0),
            new THREE.Vector3(0, -5, 0),
            new THREE.Vector3(0, 5, 0)
        ];
        
        const numSegments = waypoints.length - 1;
        const segment = Math.floor(t * numSegments);
        const progress = (t * numSegments) - segment;
        
        const start = waypoints[segment];
        const end = waypoints[segment + 1];
        
        if (start && end) {
            packet.position.lerpVectors(start, end, progress);
        }

        // Pulse the cache components slightly
        const scale = 1 + 0.05 * Math.sin(time * 5);
        l1d.scale.setScalar(scale);
        l2.scale.setScalar(1 + 0.02 * Math.sin(time * 4));
        l3.scale.setScalar(1 + 0.01 * Math.sin(time * 3));
    };

    const questions = [
        {
            question: 'Which cache is typically the fastest and smallest?',
            options: ['L1 Cache', 'L2 Cache', 'L3 Cache', 'Main Memory (RAM)'],
            answer: 0
        },
        {
            question: 'What does TLB stand for?',
            options: ['Time Limit Bound', 'Translation Lookaside Buffer', 'Total Latency Buffer', 'Transfer Level Block'],
            answer: 1
        },
        {
            question: 'Where is L3 cache usually located?',
            options: ['In the RAM module', 'On the motherboard', 'Inside each core independently', 'Shared across multiple cores on the CPU chip'],
            answer: 3
        },
        {
            question: 'What happens when a cache miss occurs?',
            options: ['Data is discarded', 'Data is fetched from the next lower level of memory', 'CPU halts indefinitely', 'Data is generated randomly'],
            answer: 1
        },
        {
            question: 'Which component acts as an intermediary between the L3 cache and RAM?',
            options: ['System Bus', 'L2 Cache', 'TLB', 'Memory Controller'],
            answer: 3
        },
        {
            question: 'What is the role of the Page Table Register?',
            options: ['Stores L1 cache data', 'Holds the base address of the active page table', 'Controls the system bus speed', 'Executes CPU instructions'],
            answer: 1
        }
    ];

    return { group, parts, animation, questions };
}
