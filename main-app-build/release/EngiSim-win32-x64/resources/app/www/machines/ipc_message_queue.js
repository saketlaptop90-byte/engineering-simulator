export function createIpcMessageQueue(THREE) {
    const group = new THREE.Group();

    // 1. User Space
    const userSpaceGeo = new THREE.BoxGeometry(20, 9.5, 10);
    const userSpaceMat = new THREE.MeshStandardMaterial({ color: 0x4444ff, transparent: true, opacity: 0.1 });
    const userSpace = new THREE.Mesh(userSpaceGeo, userSpaceMat);
    userSpace.position.set(0, 5, 0);
    group.add(userSpace);

    // 2. Kernel Space
    const kernelSpaceGeo = new THREE.BoxGeometry(20, 9.5, 10);
    const kernelSpaceMat = new THREE.MeshStandardMaterial({ color: 0xff4444, transparent: true, opacity: 0.1 });
    const kernelSpace = new THREE.Mesh(kernelSpaceGeo, kernelSpaceMat);
    kernelSpace.position.set(0, -5, 0);
    group.add(kernelSpace);

    // 3. System Call Interface
    const sciGeo = new THREE.BoxGeometry(20, 0.5, 10);
    const sciMat = new THREE.MeshStandardMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 });
    const systemCallInterface = new THREE.Mesh(sciGeo, sciMat);
    systemCallInterface.position.set(0, 0, 0);
    group.add(systemCallInterface);

    // 4. Sender Process
    const senderGeo = new THREE.BoxGeometry(2, 2, 2);
    const senderMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const senderProcess = new THREE.Mesh(senderGeo, senderMat);
    senderProcess.position.set(-6, 5, 0);
    group.add(senderProcess);

    // 5. Receiver Process
    const receiverGeo = new THREE.BoxGeometry(2, 2, 2);
    const receiverMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const receiverProcess = new THREE.Mesh(receiverGeo, receiverMat);
    receiverProcess.position.set(6, 5, 0);
    group.add(receiverProcess);

    // 6. Message Buffer
    const bufferGeo = new THREE.BoxGeometry(4, 2, 2);
    const bufferMat = new THREE.MeshStandardMaterial({ color: 0xff8800, wireframe: true });
    const messageBuffer = new THREE.Mesh(bufferGeo, bufferMat);
    messageBuffer.position.set(0, -5, 0);
    group.add(messageBuffer);

    // 7. Shared Memory Segment
    const shmGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const shmMat = new THREE.MeshStandardMaterial({ color: 0x8800ff });
    const sharedMemorySegment = new THREE.Mesh(shmGeo, shmMat);
    sharedMemorySegment.position.set(0, 5, -3);
    group.add(sharedMemorySegment);

    // 8. Semaphore
    const semGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const semMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const semaphore = new THREE.Mesh(semGeo, semMat);
    semaphore.position.set(-2, -3, 2);
    group.add(semaphore);

    // 9. Mutex Lock
    const mutexGeo = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
    const mutexMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mutexLock = new THREE.Mesh(mutexGeo, mutexMat);
    mutexLock.position.set(2, -3, 2);
    group.add(mutexLock);

    // 10. Message
    const msgGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const msgMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const message = new THREE.Mesh(msgGeo, msgMat);
    message.position.set(-6, 5, 0);
    group.add(message);

    let time = 0;

    function update(delta) {
        time += delta;
        const cycle = time % 10;

        // Reset materials
        mutexMat.color.setHex(0x00ff00); // Unlocked by default
        senderMat.color.setHex(0x00ff00);
        receiverMat.color.setHex(0x00ffff);

        if (cycle < 2) {
            // Phase 1: Sender creates message and sends to Syscall
            senderMat.color.setHex(0xffffff); // Sender active
            const p = cycle / 2;
            message.position.set(-6, 5 * (1 - p) + 0 * p, 0);
            message.visible = true;
        } else if (cycle < 4) {
            // Phase 2: Message moves to Kernel buffer
            const p = (cycle - 2) / 2;
            message.position.set(-6 * (1 - p) + 0 * p, 0 * (1 - p) + (-5) * p, 0);
            mutexMat.color.setHex(0xff0000); // Lock acquires
            mutexLock.rotation.z = p * Math.PI;
        } else if (cycle < 6) {
            // Phase 3: Message in buffer
            message.position.set(0, -5, 0);
            mutexMat.color.setHex(0xff0000); // Locked
        } else if (cycle < 8) {
            // Phase 4: Receiver requests, message moves to Syscall
            const p = (cycle - 6) / 2;
            message.position.set(0 * (1 - p) + 6 * p, -5 * (1 - p) + 0 * p, 0);
            mutexMat.color.setHex(0x00ff00); // Unlocked
            mutexLock.rotation.z = (1 - p) * Math.PI;
        } else if (cycle < 10) {
            // Phase 5: Message moves to Receiver
            const p = (cycle - 8) / 2;
            message.position.set(6, 0 * (1 - p) + 5 * p, 0);
            receiverMat.color.setHex(0xffffff); // Receiver active
        }
    }

    const quizzes = [
        {
            question: "What is the primary purpose of Inter-Process Communication (IPC)?",
            options: [
                "To increase processor clock speed",
                "To allow processes to communicate and synchronize their actions",
                "To prevent memory fragmentation",
                "To allocate CPU time efficiently"
            ],
            answer: 1
        },
        {
            question: "Which of the following IPC mechanisms typically requires the kernel to copy data twice (from sender to kernel, and from kernel to receiver)?",
            options: [
                "Shared Memory",
                "Message Queues",
                "Semaphores",
                "Mutexes"
            ],
            answer: 1
        },
        {
            question: "In the context of IPC, what is Shared Memory?",
            options: [
                "A portion of RAM that is accessible by multiple processes without involving the kernel for every data transfer",
                "A hard drive partition exclusively used by the operating system",
                "A dedicated CPU cache",
                "Memory that is swapped to disk frequently"
            ],
            answer: 0
        },
        {
            question: "What is a Mutex primarily used for?",
            options: [
                "To transfer large blocks of data",
                "To provide mutual exclusion and prevent race conditions between threads or processes",
                "To signal the end of a process",
                "To allocate network bandwidth"
            ],
            answer: 1
        },
        {
            question: "How does a Semaphore differ from a Mutex?",
            options: [
                "A semaphore can only be used by one process at a time",
                "A semaphore can have a count greater than one, allowing multiple access, whereas a mutex is strictly binary (locked/unlocked)",
                "A mutex is hardware-based, while a semaphore is software-based",
                "There is no difference; they are synonymous"
            ],
            answer: 1
        },
        {
            question: "Why is the System Call Interface necessary for Message Queues?",
            options: [
                "Because user processes cannot directly access kernel space where the message queue is maintained",
                "Because it formats the data into JSON",
                "Because it encrypts all IPC traffic",
                "Because user processes run entirely in kernel space"
            ],
            answer: 0
        }
    ];

    return { group, update, quizzes };
}
