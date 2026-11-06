package egov;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class ApplicationModulesTests {

    @Test
    void verifiesModularStructure() {
        ApplicationModules modules = ApplicationModules.of(EgovApplication.class);
        modules.verify();
    }
}

