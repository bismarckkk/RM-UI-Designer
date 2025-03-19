#include "ui.h"
#include "serialib.h"
#include "serial.h"

#include <chrono>
#include <thread>

serialib serial;

int main() {
    serial.openDevice("COM2", 115200);
    ui_self_id = 1;
    ui_objects_init();

    for (int i = 0; i < 100; i++) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        ui_default_Ungroup_NewLine->start_x += 2;
        ui_default_Ungroup_NewLine->start_y -= 2;
        ui_default_Ungroup_NewRect->start_x -= 2;
        ui_default_Ungroup_NewRect->start_y += 2;
        ui_default_Ungroup_NewText->start_x += 2;
        ui_default_Ungroup_NewText->start_y += 2;
        ui_objects_update();
    }

    serial.closeDevice();
    return 0;
}

void write(uint8_t* msg, int len) {
    serial.writeBytes(msg, len);
}
