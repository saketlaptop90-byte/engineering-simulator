export function createProcessScheduler(THREE) {
    const group = new THREE.Group();

    // 1. Ready Queue
    const readyQueueGeo = new THREE.BoxGeometry(5, 0.2, 2);
    const readyQueueMat = new THREE.MeshStandardMaterial({ color: 0x4287f5, transparent: true, opacity: 0.6 });
    const readyQueue = new THREE.Mesh(readyQueueGeo, readyQueueMat);
    readyQueue.position.set(-5, 0, 0);
    group.add(readyQueue);

    // 2. Waiting Queue
    const waitQueueGeo = new THREE.BoxGeometry(5, 0.2, 2);
    const waitQueueMat = new THREE.MeshStandardMaterial({ color: 0xf5b942, transparent: true, opacity: 0.6 });
    const waitingQueue = new THREE.Mesh(waitQueueGeo, waitQueueMat);
    waitingQueue.position.set(5, 0, 0);
    group.add(waitingQueue);

    // 3. CPU Core
    const cpuGeo = new THREE.BoxGeometry(3, 2, 3);
    const cpuMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const cpuCore = new THREE.Mesh(cpuGeo, cpuMat);
    cpuCore.position.set(0, 1.1, 0);
    
    const coreDetailGeo = new THREE.BoxGeometry(2, 2.1, 2);
    const coreDetailMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const coreDetail = new THREE.Mesh(coreDetailGeo, coreDetailMat);
    cpuCore.add(coreDetail);
    group.add(cpuCore);

    // 4. Dispatcher
    const dispatcherGeo = new THREE.CylinderGeometry(0.2, 0.2, 5, 16);
    const dispatcherMat = new THREE.MeshStandardMaterial({ color: 0x42f560 });
    const dispatcher = new THREE.Mesh(dispatcherGeo, dispatcherMat);
    dispatcher.rotation.z = Math.PI / 2;
    dispatcher.position.set(-2.5, 3, 0);
    group.add(dispatcher);

    // 5. Context Switcher
    const switcherGeo = new THREE.TorusGeometry(1.5, 0.3, 16, 32);
    const switcherMat = new THREE.MeshStandardMaterial({ color: 0x9b42f5 });
    const contextSwitcher = new THREE.Mesh(switcherGeo, switcherMat);
    contextSwitcher.rotation.x = Math.PI / 2;
    contextSwitcher.position.set(0, 0.2, 0);
    group.add(contextSwitcher);

    // 6. Timer Interrupt
    const timerGeo = new THREE.OctahedronGeometry(0.8);
    const timerMat = new THREE.MeshStandardMaterial({ color: 0xf54242 });
    const timerInterrupt = new THREE.Mesh(timerGeo, timerMat);
    timerInterrupt.position.set(0, 4, 0);
    group.add(timerInterrupt);

    // 7. PCBs (Process Control Blocks)
    const pcbs = new THREE.Group();
    const pcbGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const colors = [0xffffff, 0x00ffff, 0xff00ff];
    const processes = [];
    for (let i = 0; i < 3; i++) {
        const pcbMat = new THREE.MeshStandardMaterial({ color: colors[i] });
        const pcb = new THREE.Mesh(pcbGeo, pcbMat);
        pcb.userData = { id: i, state: 'ready', ioCycles: 0, waitTime: 0 };
        pcb.position.set(-6 + i * 1.5, 0.5, 0);
        pcbs.add(pcb);
        processes.push(pcb);
    }
    group.add(pcbs);

    // 8. I/O Devices
    const ioGeo = new THREE.CylinderGeometry(1, 1, 1.5, 16);
    const ioMat = new THREE.MeshStandardMaterial({ color: 0x42f5d1 });
    const ioDevices = new THREE.Mesh(ioGeo, ioMat);
    ioDevices.position.set(5, 0.8, 3);
    group.add(ioDevices);

    // 9. Preemption Monitor
    const monitorGeo = new THREE.BoxGeometry(2, 1.5, 0.2);
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const preemptionMonitor = new THREE.Mesh(monitorGeo, monitorMat);
    preemptionMonitor.position.set(-4, 3, -2);
    
    const screenGeo = new THREE.PlaneGeometry(1.8, 1.3);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.11;
    preemptionMonitor.add(screen);
    group.add(preemptionMonitor);

    // 10. Interrupt Vector
    const vectorGeo = new THREE.BoxGeometry(3, 0.2, 1.5);
    const vectorMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const interruptVector = new THREE.Mesh(vectorGeo, vectorMat);
    interruptVector.position.set(0, 0, 3);
    
    for(let i=0; i<4; i++) {
        const slotGeo = new THREE.BoxGeometry(0.5, 0.22, 1);
        const slotMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const slot = new THREE.Mesh(slotGeo, slotMat);
        slot.position.set(-1 + i * 0.66, 0, 0);
        interruptVector.add(slot);
    }
    group.add(interruptVector);

    // State Variables for Animation
    let readyQueueList = [0, 1, 2];
    let runningProcess = null;
    let waitingQueueList = [];
    
    let timeQuantum = 2.0;
    let currentExecTime = 0;
    let isSwitching = false;
    let switchProgress = 0;
    const switchDuration = 0.8;

    function update(delta) {
        // Animation for static parts
        timerInterrupt.rotation.y += delta * 2;
        timerInterrupt.rotation.x += delta;
        ioDevices.rotation.y -= delta;

        if (isSwitching) {
            contextSwitcher.rotation.z += delta * 4;
            switchProgress += delta;
            screenMat.color.setHex(0xffff00); // Yellow while switching
            
            if (switchProgress >= switchDuration) {
                isSwitching = false;
                switchProgress = 0;
                
                if (readyQueueList.length > 0) {
                    runningProcess = readyQueueList.shift();
                    processes[runningProcess].userData.state = 'running';
                }
                currentExecTime = 0;
            }
        } else {
            if (runningProcess !== null) {
                currentExecTime += delta;
                coreDetailMat.color.setHex(0xff5555); // Red when active
                screenMat.color.setHex(0x00ff00); // Green when running
                
                let proc = processes[runningProcess];
                let needsIO = false;
                
                // Simulate I/O request
                if (proc.userData.id === 1 && currentExecTime > timeQuantum / 2 && proc.userData.ioCycles < 2) {
                    needsIO = true;
                    proc.userData.ioCycles++;
                }

                if (needsIO) {
                    proc.userData.state = 'waiting';
                    proc.userData.waitTime = 3.0;
                    waitingQueueList.push(runningProcess);
                    runningProcess = null;
                    isSwitching = true;
                    coreDetailMat.color.setHex(0x222222);
                } else if (currentExecTime >= timeQuantum) {
                    // Preempt
                    proc.userData.state = 'ready';
                    readyQueueList.push(runningProcess);
                    runningProcess = null;
                    isSwitching = true;
                    coreDetailMat.color.setHex(0x222222);
                }
            } else {
                coreDetailMat.color.setHex(0x222222);
                screenMat.color.setHex(0x000000);
                if (readyQueueList.length > 0) {
                    isSwitching = true;
                }
            }
        }

        // Process waiting queue
        for (let i = waitingQueueList.length - 1; i >= 0; i--) {
            let pIndex = waitingQueueList[i];
            let proc = processes[pIndex];
            proc.userData.waitTime -= delta;
            
            // Blink I/O device
            ioMat.color.setHex(Math.floor(Date.now() / 200) % 2 === 0 ? 0x42f5d1 : 0x00ff00);
            
            if (proc.userData.waitTime <= 0) {
                proc.userData.state = 'ready';
                readyQueueList.push(pIndex);
                waitingQueueList.splice(i, 1);
            }
        }
        
        if(waitingQueueList.length === 0) {
            ioMat.color.setHex(0x42f5d1);
        }

        // Interpolate positions
        const lerpSpeed = 5 * delta;

        readyQueueList.forEach((pIndex, idx) => {
            let targetPos = new THREE.Vector3(-6.5 + idx * 1.5, 0.6, 0);
            processes[pIndex].position.lerp(targetPos, lerpSpeed);
        });

        waitingQueueList.forEach((pIndex, idx) => {
            let targetPos = new THREE.Vector3(3.5 + idx * 1.5, 0.6, 0);
            processes[pIndex].position.lerp(targetPos, lerpSpeed);
        });

        if (runningProcess !== null) {
            let targetPos = new THREE.Vector3(0, 2.5, 0);
            processes[runningProcess].position.lerp(targetPos, lerpSpeed);
        }
    }

    const quizzes = [
        {
            question: "What is the primary role of the Dispatcher?",
            options: [
                "To move a process from the Ready queue to the CPU",
                "To allocate memory to processes",
                "To handle I/O requests",
                "To terminate processes"
            ],
            answer: 0
        },
        {
            question: "Which component is responsible for saving and restoring the state of a process?",
            options: [
                "CPU Core",
                "Context Switcher",
                "Timer Interrupt",
                "Preemption Monitor"
            ],
            answer: 1
        },
        {
            question: "When a running process requests I/O, which queue does it move to?",
            options: [
                "Ready Queue",
                "Waiting Queue",
                "Running Queue",
                "Terminated Queue"
            ],
            answer: 1
        },
        {
            question: "What triggers a preemption in a Round Robin scheduling algorithm?",
            options: [
                "I/O Request",
                "Process termination",
                "Timer Interrupt",
                "Page Fault"
            ],
            answer: 2
        },
        {
            question: "What data structure holds the information about a process, such as its state and program counter?",
            options: [
                "Interrupt Vector",
                "Page Table",
                "Process Control Block (PCB)",
                "I/O Buffer"
            ],
            answer: 2
        },
        {
            question: "What does the Interrupt Vector typically contain?",
            options: [
                "A list of active processes",
                "Memory addresses of interrupt service routines",
                "The current time quantum",
                "The CPU cache contents"
            ],
            answer: 1
        }
    ];

    return { group, update, quizzes };
}
