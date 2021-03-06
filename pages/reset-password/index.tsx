import * as React from 'react';
// import fetch from 'isomorphic-fetch';
import { NextPageContext } from 'next';
import { StyleSheet, View } from 'react-native';
import { t } from 'i18n-js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import EmailInput from '../../components/TextInput/Email';
import Text from '../../components/Text';
import AuthUtils from '../../util/AuthUtils';
import SubmitButton from '../../components/SubmitButton';
import { ProgressStatus } from '../../data-types';
import { Action, Dispatch } from '../../actions';
import * as Actions from '../../actions/auth/resetPassword';
import { ReduxRoot } from '../../reducers';
import { PRIMARY_COLOR } from '../../styles/colors';
import { MARGIN_Y } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontWeight: '900',
    color: PRIMARY_COLOR.toString(),
    fontSize: 28,
  },
  formContainer: {
    width: '100%',
    marginTop: MARGIN_Y,
  },
});

const mapStateToProps = (state: ReduxRoot) => ({
  progress: state.auth.resetPassword.progress,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators(
    {
      resetUserPassword: Actions.resetUserPassword,
      clearProgress: () => (d: Dispatch) => d(Actions.clearResetPasswordProgress()),
    },
    dispatch
  );

interface Props extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {}

function ResetPasswordPage({ progress, resetUserPassword, clearProgress }: Props) {
  const [email, setEmail] = React.useState('');

  React.useEffect(
    () => () => {
      clearProgress();
    },
    [clearProgress]
  );

  const submitDisabled =
    !AuthUtils.isValidEmail(email) ||
    progress.status === ProgressStatus.REQUEST ||
    progress.status === ProgressStatus.SUCCESS;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('headers.resetPassword')}</Text>
      <FormContainer progress={progress} style={styles.formContainer}>
        <EmailInput
          value={email}
          onChangeText={text => {
            if (progress.status !== ProgressStatus.NIL) clearProgress();
            setEmail(text.toLowerCase());
          }}
        />
      </FormContainer>
      <SubmitButton
        label={t('buttons.reset')}
        onPress={() => {
          resetUserPassword(email);
        }}
        disabled={submitDisabled}
        loading={progress.status === ProgressStatus.REQUEST}
      />
    </View>
  );
}

ResetPasswordPage.getInitialProps = async (ctx: NextPageContext) => {
  // do async stuff here to load data
  // ctx.query is the ?params
  // eg:
  // let url = getApiUrl(urlWithQuery('/libraries', ctx.query), ctx);
  // let response = await fetch(url);
  // let result = await response.json();

  return {
    // data: result,
    // query: ctx.query,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);
