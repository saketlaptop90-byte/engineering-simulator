export function createNpnTransistor(THREE) {
    const group = new THREE.Group();

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 });
    const collMat = new THREE.MeshStandardMaterial({ color: 0x2244aa, metalness: 0.4, roughness: 0.6 });
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xaa2222, metalness: 0.4, roughness: 0.6 });
    const emitMat = new THREE.MeshStandardMaterial({ color: 0x22aa44, metalness: 0.4, roughness: 0.6 });
    const encapMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, transparent: true, opacity: 0.4, roughness: 0.1, metalness: 0.1, depthWrite: false });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.1 });

    // 1. Emitter region
    const emitterRegion = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 0.2), emitMat);
    emitterRegion.position.set(0, 7.5, -0.2);
    group.add(emitterRegion);

    // 2. Base region
    const baseRegion = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.6, 0.2), baseMat);
    baseRegion.position.set(0, 7.5, -0.4);
    group.add(baseRegion);

    // 3. Collector region
    const collectorRegion = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 0.4), collMat);
    collectorRegion.position.set(0, 7.5, -0.7);
    group.add(collectorRegion);

    // 4. Emitter lead
    const emitterLead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 15, 0.4), metalMat);
    emitterLead.position.set(2.54, -3.5, 0);
    group.add(emitterLead);

    // 5. Base lead
    const baseLead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 15, 0.4), metalMat);
    baseLead.position.set(-2.54, -3.5, 0);
    group.add(baseLead);

    // 6. Collector lead
    const collectorLead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 18.5, 0.4), metalMat);
    collectorLead.position.set(0, -1.75, -1.25);
    group.add(collectorLead);

    // 7. Encapsulation
    const encapsulation = new THREE.Mesh(new THREE.BoxGeometry(10.5, 15, 4.5), encapMat);
    encapsulation.position.set(0, 7.5, 0);
    group.add(encapsulation);

    // 8. Internal wire bonds
    const curve1 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-2.54, 4, 0),
        new THREE.Vector3(-1.77, 6, 0.5),
        new THREE.Vector3(-1.5, 7.5, -0.4)
    );
    const curve2 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(2.54, 4, 0),
        new THREE.Vector3(1.27, 6, 0.5),
        new THREE.Vector3(0, 7.5, -0.2)
    );
    const tube1 = new THREE.TubeGeometry(curve1, 16, 0.05, 8, false);
    const tube2 = new THREE.TubeGeometry(curve2, 16, 0.05, 8, false);

    const pos1 = tube1.attributes.position.array;
    const pos2 = tube2.attributes.position.array;
    const pos = new Float32Array(pos1.length + pos2.length);
    pos.set(pos1, 0); pos.set(pos2, pos1.length);

    const norm1 = tube1.attributes.normal.array;
    const norm2 = tube2.attributes.normal.array;
    const norm = new Float32Array(norm1.length + norm2.length);
    norm.set(norm1, 0); norm.set(norm2, norm1.length);

    const uv1 = tube1.attributes.uv.array;
    const uv2 = tube2.attributes.uv.array;
    const uv = new Float32Array(uv1.length + uv2.length);
    uv.set(uv1, 0); uv.set(uv2, uv1.length);

    const idx1 = tube1.index.array;
    const idx2 = tube2.index.array;
    const idx = new Uint16Array(idx1.length + idx2.length);
    idx.set(idx1, 0);
    const offset = pos1.length / 3;
    for(let i = 0; i < idx2.length; i++) {
        idx[idx1.length + i] = idx2[i] + offset;
    }

    const mergedTubes = new THREE.BufferGeometry();
    mergedTubes.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    mergedTubes.setAttribute('normal', new THREE.BufferAttribute(norm, 3));
    mergedTubes.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    mergedTubes.setIndex(new THREE.BufferAttribute(idx, 1));

    const wireBonds = new THREE.Mesh(mergedTubes, goldMat);
    group.add(wireBonds);

    // 9. Heat sink tab
    const heatSinkTab = new THREE.Mesh(new THREE.BoxGeometry(10.5, 20, 1.5), metalMat);
    heatSinkTab.position.set(0, 10, -2.25);
    group.add(heatSinkTab);

    // 10. Die attachment
    const dieAttachment = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 0.5), copperMat);
    dieAttachment.position.set(0, 7.5, -1.25);
    group.add(dieAttachment);

    // Particle Animation Setup
    const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const particleMaterialBase = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const particleMaterialCollector = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    const baseParticles = [];
    for (let i = 0; i < 8; i++) {
        const p = new THREE.Mesh(particleGeometry, particleMaterialBase);
        group.add(p);
        baseParticles.push({ mesh: p, t: i / 8 });
    }

    const collParticles = [];
    for (let i = 0; i < 30; i++) {
        const p = new THREE.Mesh(particleGeometry, particleMaterialCollector);
        group.add(p);
        collParticles.push({ mesh: p, t: i / 30 });
    }

    const baseCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.54, -11, 0),
        new THREE.Vector3(-2.54, 4, 0),
        new THREE.Vector3(-1.77, 6.0, 0.5),
        new THREE.Vector3(-1.5, 7.5, -0.4),
        new THREE.Vector3(0, 7.5, -0.3),
        new THREE.Vector3(0, 7.5, -0.2),
        new THREE.Vector3(1.27, 6.0, 0.5),
        new THREE.Vector3(2.54, 4, 0),
        new THREE.Vector3(2.54, -11, 0)
    ]);

    const collCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -11, -1.25),
        new THREE.Vector3(0, 0, -1.25),
        new THREE.Vector3(0, 7.5, -1.25),
        new THREE.Vector3(0, 7.5, -0.7),
        new THREE.Vector3(0, 7.5, -0.4),
        new THREE.Vector3(0, 7.5, -0.2),
        new THREE.Vector3(1.27, 6.0, 0.5),
        new THREE.Vector3(2.54, 4, 0),
        new THREE.Vector3(2.54, -11, 0)
    ]);

    function update(delta) {
        const baseSpeed = 0.4 * delta;
        const collSpeed = 0.8 * delta;

        baseParticles.forEach(p => {
            p.t += baseSpeed;
            if (p.t > 1) p.t -= 1;
            p.mesh.position.copy(baseCurve.getPoint(p.t));
        });

        collParticles.forEach(p => {
            p.t += collSpeed;
            if (p.t > 1) p.t -= 1;
            p.mesh.position.copy(collCurve.getPoint(p.t));
        });
    }

    const quiz = [
        {
            question: "What is the primary function of the base region in an NPN transistor?",
            options: [
                "To emit electrons into the collector",
                "To act as the main heat sink",
                "To control the current flow between the collector and emitter",
                "To block all current flow"
            ],
            correctAnswer: 2
        },
        {
            question: "In an NPN transistor, the current amplification factor (hFE or Beta) is defined as the ratio of:",
            options: [
                "Emitter current to base current",
                "Collector current to base current",
                "Base current to collector current",
                "Collector current to emitter current"
            ],
            correctAnswer: 1
        },
        {
            question: "When an NPN transistor is in saturation mode, what is the state of its junctions?",
            options: [
                "Both Base-Emitter and Base-Collector junctions are forward-biased",
                "Base-Emitter is forward-biased, Base-Collector is reverse-biased",
                "Both junctions are reverse-biased",
                "Base-Emitter is reverse-biased, Base-Collector is forward-biased"
            ],
            correctAnswer: 0
        },
        {
            question: "Which of the following best describes the cutoff region of a bipolar junction transistor?",
            options: [
                "The transistor acts as a closed switch, allowing maximum current",
                "The base current is at its maximum limit",
                "Both junctions are reverse-biased, and no significant collector current flows",
                "The transistor is actively amplifying a small AC signal"
            ],
            correctAnswer: 2
        },
        {
            question: "What physically characterizes the base region in a standard NPN bipolar junction transistor?",
            options: [
                "It is heavily doped and very thick",
                "It is lightly doped and very thin",
                "It is made of a pure intrinsic semiconductor",
                "It is identical to the collector region in doping and size"
            ],
            correctAnswer: 1
        },
        {
            question: "In the active mode, why does the majority of current flow from the collector to the emitter despite the base being in the middle?",
            options: [
                "The base region is thick, trapping most electrons",
                "The base-collector junction is forward-biased, pulling holes into the collector",
                "The thin, lightly doped base allows electrons from the emitter to sweep across into the reverse-biased collector junction",
                "The emitter region has lower doping than the base region"
            ],
            correctAnswer: 2
        }
    ];

    return {
        mesh: group,
        update,
        quiz
    };
}
