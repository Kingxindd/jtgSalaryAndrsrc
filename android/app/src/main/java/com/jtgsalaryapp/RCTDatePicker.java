package com.jtgsalaryapp;


/**
 * Created by yingjun.wang on 2017/9/16.
 */

import android.app.Activity;
import android.app.DialogFragment;
import android.widget.DatePicker;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;

import java.util.Calendar;


public class RCTDatePicker extends ReactContextBaseJavaModule {
    private Activity activity;

    public static final String REACT_CLASS = "DatePicker";

    public RCTDatePicker(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.activity = getCurrentActivity();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void showDatePicker(ReadableMap options, final Callback callback) {
//        DatePicker datePicker = new DatePicker();
//        datePicker.SetArgs(options, callback);
//        datePicker.show(activity.getFragmentManager(), REACT_CLASS);
        final Calendar c = Calendar.getInstance();
        int year = options.hasKey("year") ? options.getInt("year") : c.get(Calendar.YEAR);
        int month = options.hasKey("month") ? options.getInt("month") : c.get(Calendar.MONTH);
        int day = options.hasKey("day") ? options.getInt("day") : c.get(Calendar.DAY_OF_MONTH);
        new DatePickerDialog(getCurrentActivity(), 0, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker startDatePicker, int startYear, int startMonthOfYear, int startDayOfMonth) {
                callback.invoke(startYear, startMonthOfYear + 1);
            }
        }, year, month, day).show();
    }
}
