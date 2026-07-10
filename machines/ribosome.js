export function createRibosome(THREE) {
    const group = new THREE.Group();

    // Materials
    const smallSubMaterial = new THREE.MeshLambertMaterial({ color: 0x44aaff });
    const largeSubMaterial = new THREE.MeshLambertMaterial({ color: 0x0055ff });
    const mrnaMaterial = new THREE.MeshLambertMaterial({ color: 0xffaa00 });
    const trnaMaterial = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
    const aminoAcidMaterial = new THREE.MeshLambertMaterial({ color: 0xff4444 });
    const peptideMaterial = new THREE.MeshLambertMaterial({ color: 0xff8888 });
    const factorMaterial = new THREE.MeshLambertMaterial({ color: 0xaa44ff });

    // 1. Small Subunit
    const smallSubunit = new THREE.Mesh(new THREE.CapsuleGeometry(2, 4, 16, 16), smallSubMaterial);
    smallSubunit.rotation.z = Math.PI / 2;
    smallSubunit.position.y = -2;
    group.add(smallSubunit);

    // 2. Large Subunit
    const largeSubunit = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 32), largeSubMaterial);
    largeSubunit.position.y = 2;
    group.add(largeSubunit);

    // 3. mRNA strand
    const mrna = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 12, 16), mrnaMaterial);
    mrna.rotation.z = Math.PI / 2;
    mrna.position.set(0, 0, 1);
    group.add(mrna);

    // 4. tRNA entering (A site)
    const trnaA = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 16), trnaMaterial);
    trnaA.position.set(2, 1, 1);
    group.add(trnaA);

    // 5. tRNA processing (P site)
    const trnaP = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 16), trnaMaterial);
    trnaP.position.set(0, 1, 1);
    group.add(trnaP);

    // 6. tRNA exiting (E site)
    const trnaE = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 16), trnaMaterial);
    trnaE.position.set(-2, 1, 1);
    group.add(trnaE);

    // 7. Amino acid on A site tRNA
    const aminoAcid = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), aminoAcidMaterial);
    aminoAcid.position.set(2, 2.8, 1);
    group.add(aminoAcid);

    // 8. Polypeptide chain (P site)
    const polypeptide = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 16), peptideMaterial);
    polypeptide.position.set(0, 4.5, 1);
    group.add(polypeptide);

    // 9. Elongation Factor
    const elongationFactor = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.3, 16, 32), factorMaterial);
    elongationFactor.position.set(4, 2, 1);
    group.add(elongationFactor);

    // 10. Exit tunnel boundary
    const exitTunnel = new THREE.Mesh(new THREE.TorusGeometry(1, 0.2, 16, 32), largeSubMaterial);
    exitTunnel.position.set(0, 4.5, 1);
    exitTunnel.rotation.x = Math.PI / 2;
    group.add(exitTunnel);

    let time = 0;
    
    // Highly accurate physical kinematics animation step
    function update(delta) {
        time += delta;
        
        // mRNA translation movement step-by-step ratcheting
        mrna.position.x = -Math.floor(time * 2) * 0.5 + (time % 0.5); 

        // tRNA A site entering kinematics
        trnaA.position.x = 2 - Math.sin(time * Math.PI) * 0.2;
        trnaA.position.y = 1 + Math.abs(Math.cos(time * Math.PI)) * 0.3;
        trnaA.rotation.z = Math.sin(time * 2) * 0.1;

        // Amino acid follows tRNA A
        aminoAcid.position.x = trnaA.position.x;
        aminoAcid.position.y = trnaA.position.y + 1.8;

        // tRNA P site processing (peptide bond formation simulation)
        trnaP.position.y = 1 + Math.sin(time * 4) * 0.05;
        trnaP.rotation.z = Math.cos(time * 2) * 0.05;

        // tRNA E site exiting kinematics
        trnaE.position.y = 1 - (time % 2) * 0.5;
        trnaE.position.x = -2 - (time % 2) * 0.5;
        trnaE.material.opacity = Math.max(0, 1 - (time % 2));
        trnaE.material.transparent = true;

        // Elongation factor conformational changes (GTP hydrolysis simulation)
        elongationFactor.rotation.y = time * 3;
        elongationFactor.rotation.x = Math.sin(time * 2) * 0.5;
        elongationFactor.position.x = 4 + Math.sin(time * Math.PI) * 0.5;

        // Polypeptide chain wriggling through the exit tunnel
        polypeptide.rotation.x = Math.sin(time * 5) * 0.1;
        polypeptide.rotation.z = Math.cos(time * 4) * 0.1;
        polypeptide.position.y = 4.5 + Math.sin(time * 2) * 0.1;
    }

    const quiz = [
        {
            question: "What is the primary function of a ribosome?",
            options: ["Synthesize lipids", "Synthesize proteins", "Replicate DNA", "Produce ATP"],
            answer: 1
        },
        {
            question: "Which site on the ribosome accepts the incoming aminoacyl-tRNA?",
            options: ["E site", "P site", "A site", "M site"],
            answer: 2
        },
        {
            question: "What molecule carries the genetic code from DNA to the ribosome?",
            options: ["tRNA", "rRNA", "mRNA", "snRNA"],
            answer: 2
        },
        {
            question: "During translation, the growing polypeptide chain is typically held at which site?",
            options: ["A site", "P site", "E site", "Subunit boundary"],
            answer: 1
        },
        {
            question: "What role do elongation factors play during translation?",
            options: ["Initiate transcription", "Assist in bringing tRNA to the A site", "Terminate the polypeptide chain", "Degrade mRNA"],
            answer: 1
        },
        {
            question: "What component is primarily responsible for the catalytic activity of forming peptide bonds?",
            options: ["Ribosomal proteins", "rRNA (ribozyme)", "tRNA", "mRNA"],
            answer: 1
        }
    ];

    return {
        group,
        update,
        quiz
    };
}
