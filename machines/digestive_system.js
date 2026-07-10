export function createDigestiveSystem(THREE) {
    const root = new THREE.Group();

    const materials = {
        pharynx: new THREE.MeshStandardMaterial({ color: 0xcc7777, roughness: 0.6 }),
        esophagus: new THREE.MeshStandardMaterial({ color: 0xd88282, roughness: 0.6 }),
        stomach: new THREE.MeshStandardMaterial({ color: 0xe57373, roughness: 0.5 }),
        liver: new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.7 }),
        gallbladder: new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.4 }),
        pancreas: new THREE.MeshStandardMaterial({ color: 0xf4a460, roughness: 0.8 }),
        smallIntestine: new THREE.MeshStandardMaterial({ color: 0xdda0dd, roughness: 0.5 }),
        largeIntestine: new THREE.MeshStandardMaterial({ color: 0xcd853f, roughness: 0.6 }),
        appendix: new THREE.MeshStandardMaterial({ color: 0xbc8f8f, roughness: 0.6 }),
        rectum: new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.6 })
    };

    // 1. Pharynx
    const pharynx = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.8, 16), materials.pharynx);
    pharynx.position.set(0, 5.4, 0);
    pharynx.name = "Pharynx";
    root.add(pharynx);

    // 2. Esophagus
    const esophagus = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), materials.esophagus);
    esophagus.position.set(0, 3.5, 0);
    esophagus.name = "Esophagus";
    root.add(esophagus);

    // 3. Stomach
    const stomach = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), materials.stomach);
    stomach.scale.set(1.5, 1, 0.8);
    stomach.position.set(-0.5, 1.5, 0.2);
    stomach.rotation.z = Math.PI / 4;
    stomach.name = "Stomach";
    root.add(stomach);

    // 4. Liver
    const liver = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), materials.liver);
    liver.scale.set(1.5, 0.8, 1);
    liver.position.set(1, 2, 0.5);
    liver.rotation.z = -Math.PI / 6;
    liver.name = "Liver";
    root.add(liver);

    // 5. Gallbladder
    const gallbladder = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), materials.gallbladder);
    gallbladder.scale.set(0.8, 1.5, 0.8);
    gallbladder.position.set(0.8, 1.2, 0.8);
    gallbladder.name = "Gallbladder";
    root.add(gallbladder);

    // 6. Pancreas
    const pancreas = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 1.5, 16), materials.pancreas);
    pancreas.rotation.z = Math.PI / 2;
    pancreas.position.set(0, 1.2, -0.2);
    pancreas.name = "Pancreas";
    root.add(pancreas);

    // 7. Small Intestine
    const smallIntestine = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16), materials.smallIntestine);
    smallIntestine.position.set(0, -0.5, 0);
    smallIntestine.scale.set(1, 0.8, 0.5);
    smallIntestine.name = "Small Intestine";
    root.add(smallIntestine);

    // 8. Large Intestine
    class LargeIntestineCurve extends THREE.Curve {
        constructor() {
            super();
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = (t < 0.33) ? 1.5 : (t < 0.66) ? 1.5 - 3 * ((t - 0.33) / 0.33) : -1.5;
            const y = (t < 0.33) ? -1.5 + 2 * (t / 0.33) : (t < 0.66) ? 0.5 : 0.5 - 2 * ((t - 0.66) / 0.34);
            const z = 0;
            return optionalTarget.set(x, y, z);
        }
    }
    const largeIntestineGeo = new THREE.TubeGeometry(new LargeIntestineCurve(), 64, 0.3, 16, false);
    const largeIntestine = new THREE.Mesh(largeIntestineGeo, materials.largeIntestine);
    largeIntestine.position.set(0, -0.5, 0);
    largeIntestine.name = "Large Intestine";
    root.add(largeIntestine);

    // 9. Appendix
    const appendix = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), materials.appendix);
    appendix.position.set(1.5, -2.2, 0);
    appendix.rotation.z = Math.PI / 4;
    appendix.name = "Appendix";
    root.add(appendix);

    // 10. Rectum
    const rectum = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16), materials.rectum);
    rectum.position.set(-1.5, -2.4, 0);
    rectum.name = "Rectum";
    root.add(rectum);

    // Animation variables
    const initialStomachScale = stomach.scale.clone();
    const initialEsophagusScale = esophagus.scale.clone();
    const initialSmallIntestineScale = smallIntestine.scale.clone();
    const initialLargeIntestineScale = largeIntestine.scale.clone();
    const initialGallbladderScale = gallbladder.scale.clone();

    root.userData.update = function(time) {
        // Peristaltic wave moving down the esophagus
        const esophagusWave = Math.sin(time * 5 - esophagus.position.y);
        esophagus.scale.set(
            initialEsophagusScale.x * (1 + 0.1 * esophagusWave),
            initialEsophagusScale.y,
            initialEsophagusScale.z * (1 + 0.1 * esophagusWave)
        );

        // Churning of the stomach
        stomach.scale.set(
            initialStomachScale.x * (1 + 0.08 * Math.sin(time * 3)),
            initialStomachScale.y * (1 + 0.05 * Math.cos(time * 2.5)),
            initialStomachScale.z * (1 + 0.08 * Math.sin(time * 4))
        );

        // Segmentation contractions in small intestine
        smallIntestine.scale.set(
            initialSmallIntestineScale.x * (1 + 0.04 * Math.sin(time * 6)),
            initialSmallIntestineScale.y * (1 + 0.04 * Math.cos(time * 5.5)),
            initialSmallIntestineScale.z * (1 + 0.04 * Math.sin(time * 6.5))
        );

        // Slow mass movements in large intestine
        largeIntestine.scale.set(
            initialLargeIntestineScale.x * (1 + 0.02 * Math.sin(time * 1.5)),
            initialLargeIntestineScale.y * (1 + 0.02 * Math.cos(time * 1.2)),
            initialLargeIntestineScale.z * (1 + 0.02 * Math.sin(time * 1.4))
        );
        
        // Gallbladder slight pulse
        const gScale = 1 + 0.05 * Math.sin(time * 2);
        gallbladder.scale.set(
            initialGallbladderScale.x * gScale,
            initialGallbladderScale.y * gScale,
            initialGallbladderScale.z * gScale
        );
    };

    root.userData.quiz = [
        {
            question: "Which part of the digestive system is responsible for the majority of nutrient absorption?",
            options: ["Stomach", "Large Intestine", "Small Intestine", "Esophagus"],
            answer: 2
        },
        {
            question: "Where is bile produced?",
            options: ["Gallbladder", "Liver", "Pancreas", "Stomach"],
            answer: 1
        },
        {
            question: "Which organ stores and concentrates bile?",
            options: ["Gallbladder", "Liver", "Pancreas", "Appendix"],
            answer: 0
        },
        {
            question: "What is the primary function of the large intestine?",
            options: ["Protein digestion", "Water absorption", "Fat breakdown", "Bile production"],
            answer: 1
        },
        {
            question: "Which organ produces insulin and a majority of digestive enzymes?",
            options: ["Liver", "Gallbladder", "Pancreas", "Stomach"],
            answer: 2
        },
        {
            question: "What is the muscular tube that connects the pharynx to the stomach?",
            options: ["Small Intestine", "Trachea", "Esophagus", "Rectum"],
            answer: 2
        }
    ];

    return root;
}
