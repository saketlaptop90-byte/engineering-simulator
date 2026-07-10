export function createVirtualMemoryManager(THREE) {
    const group = new THREE.Group();

    // 1. CPU
    const cpuGeo = new THREE.BoxGeometry(2, 2, 0.5);
    const matCPU = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.5, roughness: 0.5 });
    const cpu = new THREE.Mesh(cpuGeo, matCPU);
    cpu.position.set(-4, 2, 0);
    group.add(cpu);

    // 2. Cache (L1/L2)
    const cacheGeo = new THREE.BoxGeometry(1, 0.5, 0.6);
    const matCache = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const cache = new THREE.Mesh(cacheGeo, matCache);
    cache.position.set(-4, 2.5, 0.1);
    group.add(cache);

    // 3. PCB (Process Control Block)
    const pcbGeo = new THREE.BoxGeometry(1.5, 0.5, 0.2);
    const matPCB = new THREE.MeshStandardMaterial({ color: 0x800080 });
    const pcb = new THREE.Mesh(pcbGeo, matPCB);
    pcb.position.set(-4, 3.5, 0);
    group.add(pcb);

    // 4. MMU (Memory Management Unit)
    const mmuGeo = new THREE.BoxGeometry(1.5, 1.5, 0.5);
    const matMMU = new THREE.MeshStandardMaterial({ color: 0x0055ff });
    const mmu = new THREE.Mesh(mmuGeo, matMMU);
    mmu.position.set(-1, 2, 0);
    group.add(mmu);

    // 5. TLB (Translation Lookaside Buffer)
    const tlbGeo = new THREE.BoxGeometry(1, 0.5, 0.6);
    const matTLB = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const tlb = new THREE.Mesh(tlbGeo, matTLB);
    tlb.position.set(-1, 2.5, 0.1);
    group.add(tlb);

    // 6. Data Bus
    const busGeo = new THREE.BoxGeometry(10, 0.2, 0.2);
    const matBus = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const bus = new THREE.Mesh(busGeo, matBus);
    bus.position.set(0, 0.5, 0);
    group.add(bus);

    // 7. Physical RAM
    const ramGeo = new THREE.BoxGeometry(2, 3, 0.5);
    const matRAM = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const ram = new THREE.Mesh(ramGeo, matRAM);
    ram.position.set(4, 2, 0);
    group.add(ram);

    // 8. Page Table
    const ptGeo = new THREE.BoxGeometry(1.8, 1, 0.6);
    const matPT = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const pt = new THREE.Mesh(ptGeo, matPT);
    pt.position.set(4, 3, 0.1);
    group.add(pt);

    // 9. Swap Space
    const swapGeo = new THREE.CylinderGeometry(1, 1, 1, 32);
    const matSwap = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const swap = new THREE.Mesh(swapGeo, matSwap);
    swap.position.set(4, -2, 0);
    swap.rotation.x = Math.PI / 2;
    group.add(swap);

    // 10. Page Fault Handler
    const pfhGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const matPFH = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const pfh = new THREE.Mesh(pfhGeo, matPFH);
    pfh.position.set(0, -1, 0);
    group.add(pfh);

    // Animation logic
    let time = 0;
    const allParts = [cpu, cache, pcb, mmu, tlb, bus, ram, pt, swap, pfh];
    // Animation sequence simulating a page fault and swap-in
    const animationSequence = [cpu, mmu, tlb, pt, pfh, swap, ram, bus];

    const update = (delta) => {
        time += delta;
        const step = Math.floor(time * 1.2) % animationSequence.length;

        // Reset all components
        allParts.forEach(part => {
            part.material.emissive.setHex(0x000000);
            part.scale.set(1, 1, 1);
        });

        // Highlight and pulse the active part
        const activePart = animationSequence[step];
        if (activePart) {
            activePart.material.emissive.setHex(0x555555); // Glow effect
            const pulse = 1 + 0.1 * Math.sin(time * 15);
            activePart.scale.set(pulse, pulse, pulse);
        }
    };

    const quizzes = [
        {
            question: "What is the primary purpose of Virtual Memory?",
            options: [
                "To increase CPU clock speed",
                "To allow execution of processes that are not completely in memory",
                "To permanently store data",
                "To replace physical RAM completely"
            ],
            answer: 1
        },
        {
            question: "What does the Memory Management Unit (MMU) do?",
            options: [
                "Executes arithmetic instructions",
                "Translates virtual addresses to physical addresses",
                "Manages hard drive partitions",
                "Stores user passwords"
            ],
            answer: 1
        },
        {
            question: "What is a Translation Lookaside Buffer (TLB)?",
            options: [
                "A secondary storage device",
                "A type of read-only memory",
                "A hardware cache for the page table",
                "An operating system interrupt handler"
            ],
            answer: 2
        },
        {
            question: "When does a Page Fault occur?",
            options: [
                "When the CPU overheats",
                "When a program accesses a memory page not currently in physical RAM",
                "When the TLB is full",
                "When physical RAM is completely empty"
            ],
            answer: 1
        },
        {
            question: "What role does Swap Space play in virtual memory?",
            options: [
                "It is a designated area on the disk used to simulate additional RAM",
                "It is the fastest cache in the CPU",
                "It stores BIOS settings",
                "It prevents memory fragmentation"
            ],
            answer: 0
        },
        {
            question: "Which data structure is used by the OS to map virtual pages to physical frames?",
            options: [
                "Process Control Block (PCB)",
                "File Allocation Table (FAT)",
                "Page Table",
                "Inverted Binary Tree"
            ],
            answer: 2
        }
    ];

    return { group, update, quizzes };
}
