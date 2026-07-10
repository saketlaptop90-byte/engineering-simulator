export function createSSRIMechanism(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. Presynaptic Neuron
    const presynapticGeo = new THREE.CylinderGeometry(2, 2, 5, 32, 1, false, 0, Math.PI);
    const presynapticMat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, transparent: true, opacity: 0.8 });
    const presynaptic = new THREE.Mesh(presynapticGeo, presynapticMat);
    presynaptic.rotation.x = Math.PI / 2;
    presynaptic.position.set(0, 5, 0);
    group.add(presynaptic);
    parts.push({ name: "Presynaptic Neuron", description: "The nerve cell that releases serotonin.", mesh: presynaptic });

    // 2. Synaptic Vesicles
    const vesicles = new THREE.Group();
    const vesicleGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const vesicleMat = new THREE.MeshStandardMaterial({ color: 0xa8c545 });
    for (let i = 0; i < 5; i++) {
        const vesicle = new THREE.Mesh(vesicleGeo, vesicleMat);
        vesicle.position.set((Math.random() - 0.5) * 2, 4 + Math.random(), (Math.random() - 0.5) * 2);
        vesicles.add(vesicle);
    }
    group.add(vesicles);
    parts.push({ name: "Synaptic Vesicles", description: "Small sacs that store serotonin before release.", mesh: vesicles });

    // 3. Serotonin Molecules
    const serotonins = new THREE.Group();
    const serotoninGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const serotoninMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    for (let i = 0; i < 20; i++) {
        const serotonin = new THREE.Mesh(serotoninGeo, serotoninMat);
        serotonin.position.set((Math.random() - 0.5) * 3, Math.random() * 2 - 1, (Math.random() - 0.5) * 3);
        serotonins.add(serotonin);
    }
    group.add(serotonins);
    parts.push({ name: "Serotonin Molecules", description: "Neurotransmitter molecules that carry signals across the synapse.", mesh: serotonins });

    // 4. Synaptic Cleft
    const cleftGeo = new THREE.BoxGeometry(4, 3, 4);
    const cleftMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }); // invisible volume
    const cleft = new THREE.Mesh(cleftGeo, cleftMat);
    cleft.position.set(0, 0, 0);
    group.add(cleft);
    parts.push({ name: "Synaptic Cleft", description: "The gap between neurons where serotonin is released.", mesh: cleft });

    // 5. Postsynaptic Receptors
    const receptors = new THREE.Group();
    const receptorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5);
    const receptorMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    for (let i = 0; i < 5; i++) {
        const receptor = new THREE.Mesh(receptorGeo, receptorMat);
        receptor.position.set((i - 2) * 0.8, -2.5, 0);
        receptors.add(receptor);
    }
    group.add(receptors);
    parts.push({ name: "Postsynaptic Receptors", description: "Proteins on the receiving neuron that bind serotonin.", mesh: receptors });

    // 6. Serotonin Transporter
    const transporters = new THREE.Group();
    const transporterGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const transporterMat = new THREE.MeshStandardMaterial({ color: 0x8e44ad });
    for(let i=0; i<2; i++) {
        const transporter = new THREE.Mesh(transporterGeo, transporterMat);
        transporter.position.set(i === 0 ? -1.5 : 1.5, 2.5, 0);
        transporters.add(transporter);
    }
    group.add(transporters);
    parts.push({ name: "Serotonin Transporter", description: "Pumps serotonin back into the presynaptic neuron (reuptake).", mesh: transporters });

    // 7. SSRI Medication
    const ssris = new THREE.Group();
    const ssriGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const ssriMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71 });
    for(let i=0; i<2; i++) {
        const ssri = new THREE.Mesh(ssriGeo, ssriMat);
        ssri.position.set(i === 0 ? -1.5 : 1.5, 2.2, 0);
        ssris.add(ssri);
    }
    group.add(ssris);
    parts.push({ name: "SSRI Medication", description: "Selective Serotonin Reuptake Inhibitors that block the transporter.", mesh: ssris });

    // 8. Calcium Channels
    const channels = new THREE.Group();
    const channelGeo = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
    const channelMat = new THREE.MeshStandardMaterial({ color: 0xf39c12 });
    for(let i=0; i<2; i++) {
        const channel = new THREE.Mesh(channelGeo, channelMat);
        channel.position.set(i === 0 ? -2 : 2, 4, 0);
        channel.rotation.y = Math.PI / 2;
        channels.add(channel);
    }
    group.add(channels);
    parts.push({ name: "Calcium Channels", description: "Allow calcium influx to trigger vesicle release.", mesh: channels });

    // 9. Action Potential
    const actionPotentialGeo = new THREE.BoxGeometry(0.1, 2, 0.1);
    const actionPotentialMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const actionPotential = new THREE.Mesh(actionPotentialGeo, actionPotentialMat);
    actionPotential.position.set(0, 8, 0);
    group.add(actionPotential);
    parts.push({ name: "Action Potential", description: "Electrical signal traveling down the neuron.", mesh: actionPotential });

    // 10. Postsynaptic Signal
    const postSignalGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const postSignalMat = new THREE.MeshBasicMaterial({ color: 0xe74c3c, transparent: true, opacity: 0 });
    const postSignal = new THREE.Mesh(postSignalGeo, postSignalMat);
    postSignal.position.set(0, -4, 0);
    group.add(postSignal);
    parts.push({ name: "Postsynaptic Signal", description: "The resulting electrical signal in the receiving neuron.", mesh: postSignal });

    let time = 0;
    
    return {
        group,
        parts,
        update: (delta) => {
            time += delta;

            // Action Potential travels down
            actionPotential.position.y = 8 - (time * 5) % 8;
            if (actionPotential.position.y < 3) actionPotential.position.y = 8;
            
            // Calcium channels pulsing
            channels.scale.setScalar(1 + Math.sin(time * 10) * 0.1);

            // Vesicles jiggle
            vesicles.children.forEach((vesicle, index) => {
                vesicle.position.y += Math.sin(time * 5 + index) * 0.01;
            });

            // Serotonin movement
            serotonins.children.forEach((serotonin, index) => {
                serotonin.position.y -= delta * 0.5;
                if (serotonin.position.y < -2.5) {
                    serotonin.position.y = 2.5; // Back to top (recycled or new)
                }
                serotonin.position.x += Math.sin(time * 3 + index) * 0.02;
            });

            // SSRI interaction
            ssris.children.forEach((ssri, index) => {
                // Block the transporter
                ssri.position.y = 2.5 + Math.sin(time * 2 + index) * 0.1;
            });
            
            // Postsynaptic Signal glowing based on serotonin level in cleft
            postSignal.material.opacity = 0.5 + 0.5 * Math.sin(time * 2);
            postSignal.scale.setScalar(1 + Math.sin(time * 4) * 0.2);
        },
        quiz: [
            {
                question: "What is the primary function of an SSRI?",
                options: [
                    "To increase serotonin production",
                    "To block the reuptake of serotonin",
                    "To destroy serotonin in the synapse",
                    "To block postsynaptic receptors"
                ],
                correctAnswer: 1,
                explanation: "SSRIs block the serotonin transporter, preventing the reuptake of serotonin and leaving more available in the synaptic cleft."
            },
            {
                question: "Where are serotonin molecules stored before release?",
                options: [
                    "In the nucleus",
                    "In postsynaptic receptors",
                    "In synaptic vesicles",
                    "In the synaptic cleft"
                ],
                correctAnswer: 2,
                explanation: "Serotonin is stored in synaptic vesicles within the presynaptic neuron."
            },
            {
                question: "What triggers the release of synaptic vesicles?",
                options: [
                    "Action potential and calcium influx",
                    "SSRI binding",
                    "Serotonin reuptake",
                    "Potassium efflux"
                ],
                correctAnswer: 0,
                explanation: "An action potential reaching the terminal causes calcium channels to open, and the influx of calcium triggers vesicle fusion and neurotransmitter release."
            },
            {
                question: "Which component removes serotonin from the synaptic cleft under normal conditions?",
                options: [
                    "Calcium channels",
                    "Serotonin Transporter (SERT)",
                    "Postsynaptic receptors",
                    "Synaptic vesicles"
                ],
                correctAnswer: 1,
                explanation: "The serotonin transporter (SERT) is responsible for the reuptake of serotonin back into the presynaptic neuron."
            },
            {
                question: "What is the space between the presynaptic and postsynaptic neurons called?",
                options: [
                    "Synaptic Cleft",
                    "Axon Terminal",
                    "Dendrite",
                    "Soma"
                ],
                correctAnswer: 0,
                explanation: "The synaptic cleft is the narrow gap where neurotransmitters are released."
            },
            {
                question: "By blocking reuptake, SSRIs effectively ________ the signal to the postsynaptic neuron.",
                options: [
                    "Decrease",
                    "Enhance",
                    "Stop",
                    "Reverse"
                ],
                correctAnswer: 1,
                explanation: "By keeping more serotonin in the synaptic cleft for longer, SSRIs enhance the stimulation of postsynaptic receptors."
            }
        ]
    };
}
