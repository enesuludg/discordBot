export const pipeline = (githubUrl,branch) => {

  return `<?xml version='1.1' encoding='UTF-8'?>
  <flow-definition plugin="workflow-job@1207.ve6191ff089f8">
    <actions>
      <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@2.2114.v2654ca_721309"/>
      <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@2.2114.v2654ca_721309">
        <jobProperties/>
        <triggers/>
        <parameters/>
        <options/>
      </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
    </actions>
    <description></description>
    <keepDependencies>false</keepDependencies>
    <properties>
      <com.sonyericsson.rebuild.RebuildSettings plugin="rebuild@1.34">
        <autoRebuild>false</autoRebuild>
        <rebuildDisabled>false</rebuildDisabled>
      </com.sonyericsson.rebuild.RebuildSettings>
      <hudson.model.ParametersDefinitionProperty>
        <parameterDefinitions>
          <hudson.model.BooleanParameterDefinition>
            <name>pod</name>
            <defaultValue>false</defaultValue>
          </hudson.model.BooleanParameterDefinition>
        </parameterDefinitions>
      </hudson.model.ParametersDefinitionProperty>
    </properties>
    <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2746.v0da_83a_332669">
      <scm class="hudson.plugins.git.GitSCM" plugin="git@4.11.3">
        <configVersion>2</configVersion>
        <userRemoteConfigs>
          <hudson.plugins.git.UserRemoteConfig>
            <url>${githubUrl}</url>
            <credentialsId>enes</credentialsId>
          </hudson.plugins.git.UserRemoteConfig>
        </userRemoteConfigs>
        <branches>
          <hudson.plugins.git.BranchSpec>
            <name>*/${branch}<</name>
          </hudson.plugins.git.BranchSpec>
        </branches>
        <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
        <submoduleCfg class="empty-list"/>
        <extensions>
          <hudson.plugins.git.extensions.impl.CloneOption>
            <shallow>false</shallow>
            <noTags>false</noTags>
            <reference></reference>
            <timeout>30</timeout>
            <honorRefspec>false</honorRefspec>
          </hudson.plugins.git.extensions.impl.CloneOption>
        </extensions>
      </scm>
      <scriptPath>Jenkinsfile</scriptPath>
      <lightweight>true</lightweight>
    </definition>
    <triggers/>
    <authToken>test</authToken>
    <disabled>false</disabled>
  </flow-definition>
  `
  };