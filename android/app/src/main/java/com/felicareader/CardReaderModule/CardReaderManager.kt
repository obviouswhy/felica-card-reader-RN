package com.felicareader.CardReaderModule

import android.widget.Toast
import com.example.waeoncardreadernfc.cardReader.CardReader
import java.util.*
import android.app.Activity
import android.nfc.Tag
import android.nfc.tech.NfcF
import android.util.Log
import android.widget.TextView
import com.example.cardreadernfc.utils.Utils
import com.example.waeoncardreadernfc.cardReader.CardReaderInterface
import com.facebook.react.bridge.*
import com.felicareader.MainActivity
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter


class CardReaderManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    val cardReader =  CardReader(reactContext, MainActivity.getActivity() )

    override fun getName(): String {
        return "CardReaderModule"
    }

    override fun getConstants(): Map<String, Any>? {
        val constants = HashMap<String, Any>()
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT)
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG)
        return constants
    }

    @ReactMethod
    fun Toastshow(message: String, duration: Int) {
        Toast.makeText(reactApplicationContext, message, duration).show()
    }
    companion object {

        private val DURATION_SHORT_KEY = "SHORT"
        private val DURATION_LONG_KEY = "LONG"
    }

    @ReactMethod
    fun startScan() {
        println("---- startScan() ----")
        cardReader.setListener(cardListener)
        cardReader?.start()
        Toast.makeText(reactApplicationContext, "Started Scanning...", Toast.LENGTH_SHORT).show()
    }

    @ReactMethod
    fun stopScan() {
        println("---- stopScan() ----")
        cardReader?.stop()
        Toast.makeText(reactApplicationContext, "Stopped Scanning", Toast.LENGTH_SHORT).show()
    }

    private val cardListener = object : CardReaderInterface {
        override fun onReadTag(tag : Tag) {
            tag.techList

            val idm : ByteArray = tag.id
            val nfc : NfcF = NfcF.get(tag) ?: return
            val systemCode : ByteArray = nfc.systemCode
            val manufacturer  : ByteArray = nfc.manufacturer

            println("_____________onReadTag_______________")
            println("idm -> ${Utils.byteToHex(idm)}")
            println("systemCode -> ${Utils.byteToHex(systemCode)}")
            println("manufacturer -> ${Utils.byteToHex(manufacturer)}")
            val rnResponse: WritableMap = Arguments.createMap()
            rnResponse.putString("idm", Utils.byteToHex(idm))
            rnResponse.putString("manufacturer", Utils.byteToHex(manufacturer))
            rnResponse.putBoolean("isWaon", Utils.isWaon(Utils.byteToHex(systemCode)))

            if (Utils.isWaon(Utils.byteToHex(systemCode))) {
                println("_____________GET WAON NUMBER_______________")
                try {
                    nfc.connect()
                    val polling_request = byteArrayOf(
                        0x06.toByte(), // Packet size (6 bytes for Read Without Encryption) [https://wiki.onakasuita.org/pukiwiki/?FeliCa%2Fコマンド%2FRead%20Without%20Encryption], [4-4-5 from: https://www.sony.net/Products/felica/business/tech-support/data/card_usersmanual_2.11e.pdf]
                        0x00.toByte(), // Command code (00h -> polling) [Table 2-3 from: https://www.sony.net/Products/felica/business/tech-support/data/card_usersmanual_2.11e.pdf]
                        0xFE.toByte(), 0x00.toByte(), // System code (FE00 for WAON, 0003 for SUICA/PASMO/etc)
                        0x00.toByte(), // Request code (00h -> No Request) [4-4-2 Packet structure from: https://www.sony.net/Products/felica/business/tech-support/data/card_usersmanual_2.11e.pdf]
                        0x00.toByte()  // Timeslot [4-4-2 from: https://www.sony.net/Products/felica/business/tech-support/data/card_usersmanual_2.11e.pdf]
                    )

                    val polling_response = nfc.transceive(polling_request)
                    val idm_from_polling_response: ByteArray = Arrays.copyOfRange(polling_response, 2, 10) // idm => 8bits starting from 2nd (1st is Response Code)  [4-4-2 ResponsePacketData from: https://www.sony.net/Products/felica/business/tech-support/data/card_usersmanual_2.11e.pdf]
                    val pmm = Arrays.copyOfRange(polling_response, 11, 19) // pmm => 8bits starting after idm
                    println(Utils.byteToHex(idm))
                    println(Utils.byteToHex(pmm))
                    val waon_number_request: ByteArray? = Utils.readWithoutEncryption(idm_from_polling_response, 2)
                    val waon_number_response = nfc.transceive(waon_number_request)
                    val waon_number = Arrays.copyOfRange(waon_number_response, 13, 21) // Block Data starts after the 12nd byte [4-4-5 from: https://www.sony.net/Products/felica/business/tech-support/data/card_usersmanual_2.11e.pdf]
                    println("waon number -> ${Utils.byteToHex(waon_number)}")
                    rnResponse.putString("waonNumber", Utils.byteToHex(waon_number))

                    nfc.close()
                } catch (e : Exception) {
                    nfc.close()
                }
            }
            try {
                reactContext.getJSModule(RCTDeviceEventEmitter::class.java).emit("onReadTag", rnResponse)
            } catch (e: java.lang.Exception) {
                Log.e("ReactNative", "Caught Exception: " + e.message)
            }
            println("_______________________________________________")
        }

    }
}