import React from "react";
import { useFormikContext } from "formik";
import { Button, Icon } from "native-base";
import colors from "../../config/colors";

function FilterSubmitButton({ title, color = "primary" }) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      iconLeft
      dark
      onPress={handleSubmit}
      style={{
        width: 78,
        height: 55,
        backgroundColor: colors.light,
        alignSelf: "center",
        justifyContent: "center",
        paddingRight: 15,
        marginLeft: 10,
        borderRadius: 15,
      }}
    >
      <Icon
        name="search"
        color={colors.primary}
        style={{ color: colors.primary, alignSelf: "center" }}
      />
    </Button>
  );
}

export default FilterSubmitButton;
